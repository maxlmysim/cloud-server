import {Schema, model, ObjectId} from 'mongoose';
import File from "./File.js";

const FolderSchema = new Schema({
    name: {type: String, required: true},
    user: {type: ObjectId, ref: 'User', required: true},
    parentFolderId: {type: ObjectId, ref: 'Folder'},
    path: {type: String, required: true},
    childListFolderId: [{type: ObjectId, ref: 'Folder'}],
    files: [{type: ObjectId, ref: 'File'}],
    size: {type: Number, default: 0},
});

// Adding indexes for better performance
FolderSchema.index({user: 1, parentFolderId: 1});
FolderSchema.index({user: 1, _id: 1});

// Middleware to handle cascade delete of nested folders and files
FolderSchema.pre('findOneAndDelete', async function (next) {
    const folderToDelete = await this.model.findOne(this.getQuery());

    if (!folderToDelete) return next(new Error('Folder not found'));

    if (folderToDelete.parentFolderId) {
        const parentFolderId = folderToDelete.parentFolderId;
        await this.model.findOneAndUpdate(
            {_id: parentFolderId, user: folderToDelete.user},
            {$pull: {childListFolderId: folderToDelete._id}}
        )
    }

    for (const fileId of folderToDelete.files) {
        await File.findOneAndDelete({user: folderToDelete.user, _id: fileId})
    }

    for (const folderId of folderToDelete.childListFolderId) {
        await this.model.findOneAndDelete({user: folderToDelete.user, _id: folderId})
    }

    next();
});


export default model('Folder', FolderSchema);
