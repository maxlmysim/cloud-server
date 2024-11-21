import {Schema, model, ObjectId} from 'mongoose';
import User from "./User.js";
import Folder from "./Folder.js";

const FileSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    accessLink: {type: String},
    user: {type: ObjectId, ref: 'User', required: true},
    folder: {type: ObjectId, ref: 'Folder'},
    createdAt: {type: Date, default: Date.now},
    lastAccessedAt: {type: Date}
});

FileSchema.index({user: 1, folder: 1});
FileSchema.index({accessLink: 1});

FileSchema.pre('find', function () {
    this.update({}, {lastAccessedAt: Date.now()});
});

FileSchema.pre('findOneAndDelete', async function (next) {
    try {
        const fileToDelete = await this.model.findOne(this.getQuery());
        if (!fileToDelete) {
            return next(new Error('File not found'));
        }

        await Folder.findByIdAndUpdate(
            {_id: fileToDelete.folder},
            {$pull: {files: fileToDelete._id}}
        );

        next();
    } catch (e) {
        return next(e)
    }
});

export default model('File', FileSchema);
