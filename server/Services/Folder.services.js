import fs from 'fs';
import path from 'path';
import {filesDir} from "../files/fileDir.js";
import Folder from "../models/Folder.js";
import mongoose from "mongoose";
import File from "../models/File.js";
import FileService from "./File.service.js";
import UserService from "./User.service.js";

class FolderServices {
    create = async (userId, parentFolderId, nameFolder) => {
        try {
            const userObjId = new mongoose.Types.ObjectId(userId);
            const parentFolderObjId = parentFolderId ? new mongoose.Types.ObjectId(parentFolderId) : null;

            if (!parentFolderObjId) {
                await this._createDir([userId, nameFolder])

                return await Folder.create({
                    name: nameFolder,
                    parentFolderId: null,
                    user: userId,
                    path: '/' + nameFolder
                })
            }

            // Проверяем наличие родительской папки по _id
            const parentFolder = await Folder.findOne({
                user: userObjId,
                _id: parentFolderObjId
            });

            if (!parentFolder) {
                throw 'Parent folder not found';
            }

            await this._createDir([userId, parentFolder.path, nameFolder])
            const pathFolder = path.join(parentFolder.path, nameFolder)

            const createdFolder = await Folder.create({
                name: nameFolder,
                parentFolderId: parentFolder?._id,
                user: userId,
                path: pathFolder
            })

            const parentFolderUpdated = await Folder.findByIdAndUpdate(
                parentFolderObjId,
                {$push: {childListFolderId: createdFolder._id}},
                {new: true}
            )

            const parentFolderWithData = await this.getFolderWithData(parentFolderUpdated)

            return {current: createdFolder, parent: parentFolderWithData}

        } catch (e) {
            throw new Error(e);
        }

    }

    createRootFolder = async (userId) => {
        try {
            const userFolderPath = path.join(filesDir, userId);

            if (await this.folderExists(userFolderPath)) {
                return;
            }

            await this._createDir([path.parse('/').root, userId])

            await Folder.create({
                name: '/', parentFolderId: null, user: userId, path: '/'
            })
        } catch (e) {
            console.error(`Ошибка при создании папки для пользователя ${userId}:`, e);
            throw new Error(e);
        }
    }

    async delete(folderId, userId) {
        try {
            const userObjId = new mongoose.Types.ObjectId(userId);
            const folderObjId = new mongoose.Types.ObjectId(folderId);

            const targetFolder = await
                Folder.findOneAndDelete({user: userObjId, _id: folderObjId});

            this._deleteDir([userId, targetFolder.path])

            if (!targetFolder) {
                throw 'Folder not found';
            }

            await this.updateSize(targetFolder.parentFolderId)
            return targetFolder
        } catch (e) {
            throw new Error(e);
        }
    }

    async get(folderId, userId) {
        try {
            const userObjId = new mongoose.Types.ObjectId(userId);
            const folderObjId = new mongoose.Types.ObjectId(folderId);

            if (folderId === null) {
                const targetFolder = await Folder.findOne({user: userObjId, parentFolderId: null})

                return await this.getFolderWithData(targetFolder);
            }

            const targetFolder = await Folder.findOne({user: userObjId, _id: folderObjId})

            if (!targetFolder) {
                throw 'Folder not found';
            }

            return await this.getFolderWithData(targetFolder);
        } catch (e) {
            throw new Error(e);
        }
    }

    async getFolderWithData(targetFolder) {
        try {
            const [listFolder, fileList] = await Promise.all([
                Promise.all(
                    targetFolder.childListFolderId?.map(folderId => Folder.findById(folderId)) || []
                ),
                Promise.all(
                    targetFolder.files?.map(fileId => File.findById(fileId)) || []
                )
            ])

            if (targetFolder instanceof mongoose.Document) {
                return {...targetFolder.toObject(), childListFolderId: listFolder, files: fileList}
            }

            return {...targetFolder, childListFolderId: listFolder, files: fileList}
        } catch (e) {
            throw new Error(e);
        }
    }

    async folderExists(folderPath) {
        try {
            await fs.promises.access(folderPath);
            return true;
        } catch {
            return false;
        }
    }

    async _createDir(pathFolder) {
        try {
            const targetPath = path.join(filesDir, ...pathFolder)

            await fs.promises.mkdir(targetPath, {recursive: true})

            return targetPath
        } catch (e) {
            throw new Error(e)
        }
    }

    async _deleteDir(pathFolder) {
        try {
            const targetPath = path.join(filesDir, ...pathFolder)

            await fs.promises.rm(targetPath, {recursive: true})
        } catch (e) {
            console.error(e)
        }
    }

    async updateSize(folderId) {
        const targetFolder = await Folder.findOne({_id: folderId});

        if (!targetFolder) {
            throw 'Folder not found';
        }

        const children = []

        for (const file of targetFolder.files) {
            children.push(FileService.getInfo(file._id, targetFolder.user))
        }

        for (const folder of targetFolder.childListFolderId) {
            children.push(this.getInfo(folder._id, targetFolder.user))
        }

        const result = await Promise.all(children)

        const totalSize = result.reduce((acc, {size}) => acc + size, 0)

        const updatedFolder = await Folder.findOneAndUpdate(
            {_id: folderId},
            {size: totalSize},
            {new: true}
        );

        if (updatedFolder.parentFolderId) {
            await this.updateSize(updatedFolder.parentFolderId)
        } else {
            await UserService.updateUsedSpace(updatedFolder.user)
        }
    }

    async getRootFolder(userId) {
        try {
            return await Folder.findOne({user: userId, parentFolderId: null})
        } catch (e) {
            throw new Error(e)
        }
    }

    async getInfo(folderId, userId) {
        try {
            return await Folder.findOne({user: userId, _id: folderId})
        } catch (e) {
            throw new Error(e)
        }
    }
}

export default new FolderServices()