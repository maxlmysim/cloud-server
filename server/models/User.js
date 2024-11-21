import { Schema, model, ObjectId } from 'mongoose';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    diskSpace: { type: Number, default: 1024 ** 3 * 10 }, // Default: 10 GB
    usedSpace: { type: Number, default: 0 },
    files: [{ type: ObjectId, ref: 'File' }]
});

// Index for better performance on frequently queried fields
UserSchema.index({ email: 1 });

export default model('User', UserSchema);
