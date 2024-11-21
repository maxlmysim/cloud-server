import Folder from "../models/Folder.js";
import mongoose from "mongoose";
import File from "../models/File.js";
import path from "path";
import {filesDir} from "../files/fileDir.js";
import fs from "fs";
import FolderServices from "./Folder.services.js";
import UserService from "./User.service.js";

class FileService {
    async upload(file, folderId, userId) {
        const userObjId = new mongoose.Types.ObjectId(userId);
        const folderObjId = folderId ? new mongoose.Types.ObjectId(folderId) : null;

        let targetFolder
        if (folderObjId) {
            targetFolder = await Folder.findOne({user: userObjId, _id: folderObjId})
        } else {
            //     root folder
            targetFolder = await Folder.findOne({user: userObjId, parentFolderId: null})
        }

        if (!targetFolder) {
            throw new Error('Folder not found')
        }

        const pathFile = path.join(targetFolder.path, file.name)

        if (this.isFileExists([userId, pathFile])) {
            throw new Error('File already exists')
        }

        const createdFile = await File.create({
            name: file.name,
            type: file.mimetype,
            size: file.size,
            path: pathFile,
            user: userObjId,
            folder: targetFolder._id,
        })

        targetFolder = await Folder.findByIdAndUpdate(
            targetFolder._id,
            {$push: {files: createdFile._id}},
            {new: true}
        );

        const uploadPath = path.join(filesDir, userId, targetFolder.path, createdFile.name);
        await fs.promises.mkdir(path.dirname(uploadPath), {recursive: true});

        await this.moveFile(file, uploadPath);
        await FolderServices.updateSize(targetFolder._id)
    }

    isFileExists(filePath) {
        return fs.existsSync(path.join(filesDir, ...filePath))
    }

    async moveFile(file, uploadPath) {
        return new Promise((resolve, reject) => {
            file.mv(uploadPath, (err) => {
                if (err) {
                    reject(new Error(`Error moving file: ${err.message}`));
                } else {
                    resolve();
                }
            });
        });
    }

    async deleteFromLocal(path) {
        return fs.promises.unlink(path)
    }

    async delete(file, userId) {
        try {
            const userObjId = new mongoose.Types.ObjectId(userId);
            const fileObjId = new mongoose.Types.ObjectId(file._id);
            const folderObjId = new mongoose.Types.ObjectId(file.folder);

            await File.findOneAndDelete({user: userObjId, _id: fileObjId, folder: folderObjId});
            const updatedFolder = await Folder.findOne({user: userObjId, _id: folderObjId})
            await this.deleteFromLocal(path.join(filesDir, userId, file.path))

            await FolderServices.updateSize(updatedFolder._id)

            return await FolderServices.getFolderWithData(updatedFolder)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getInfo(fileId, userId) {
        try {
            return await File.findOne({user: userId, _id: fileId})
        } catch (e) {
            throw new Error(e)
        }
    }


}

export default new FileService()