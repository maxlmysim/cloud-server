import FileService from "../Services/File.service.js";
import FolderServices from "../Services/Folder.services.js";
import {filesDir} from "../files/fileDir.js";
import path from "path";
import fs from "fs";

class FileController {
    async upload(req, res) {
        try {
            const userId = req.userId;

            const files = [req.files.file].flat();

            files.forEach((file) => {
                file.name = decodeURIComponent(escape(file.name));
            });

            const parentFolderId = req.body.parentFolderId;

            const uploadPromises = files.map(file =>
                FileService.upload(file, parentFolderId, userId)
            );

            await Promise.all(uploadPromises);

            const parentFolder = await FolderServices.getFolderWithData(
                await FolderServices.get(parentFolderId, userId)
            );

            return res.status(200).json({parent: parentFolder});
        } catch (e) {
            res.status(500).json({
                message: 'Ошибка сервера при загрузке файлов',
                error: e.message
            });

            console.error(e)
        }
    }

    async delete(req, res) {
        try {
            const userId = req.userId

            if (!req.body._id) {
                return res.status(400).json({message: 'Bad request'})
            }

            const updatedFolder = await FileService.delete(req.body, userId)

            res.status(200).json({parent: updatedFolder})
        } catch (e) {
            res.status(500).json({message: 'Error server', error: e.message})
            console.error(e)
        }
    }

    async download(req, res) {
        try {
            const id = req.query.id
            if (!id) {
                return res.status(400).json({message: 'Bad request'})
            }

            const file = await FileService.getInfo(id, req.userId)
            if (!file) {
                res.status(404).json({message: 'File not found'})
            }

            const localPath = path.join(filesDir, req.userId, file.path)
            if(fs.existsSync(localPath)) {
                return res.download(localPath, file.name)
            } else {
                return res.status(400).json({message: 'Download error'})
            }
        } catch (e) {
            res.status(500).json({message: 'Error server', error: e.message})
        }
    }

}

export default new FileController()