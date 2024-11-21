import FolderServices from "../Services/Folder.services.js";

class FolderController {
    create = async (req, res) => {
        try {
            const {parentFolderId, name} = req.body
            const {current, parent} = await FolderServices.create(req.userId, parentFolderId, name.trim())

            res.status(200).json({current, parent})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка сервера', error: e.message})
        }
    }

    async delete(req, res) {
        try {
            const {folderId} = req.body

            const deletedFolder = await FolderServices.delete(folderId, req.userId)

            const parentFolder = await FolderServices.get(deletedFolder.parentFolderId, req.userId)

            res.status(200).json({current: deletedFolder, parent: parentFolder})
        } catch (e) {
            console.error(e)
            res.status(500).json({message: 'server error', error: e.message})
        }
    }

    async get(req, res) {
        try {
            const userId = req.userId
            const {folderId} = req.body

            const result = await FolderServices.get(folderId, userId)

            res.status(200).json(result)

        } catch (e) {
            req.status(500).json({message: 'server error', error: e.message})
        }
    }
}

export default new FolderController()