import User from "../models/User.js";
import bcrypt from "bcryptjs";
import FolderServices from "./Folder.services.js";

class UserService {

    async register(email, password) {
        const hashPassword = await bcrypt.hash(password, 5)

        return await User.create({email, password: hashPassword})
    }

    async getById(id) {
        return User.findById(id);
    }

    async getByEmail(email) {
        return User.findOne({email})
    }

    async updateUsedSpace(id) {
        const user = await User.findById(id)
        if (!user) {
            throw new Error('User not found')
        }

        const rootFolder = await FolderServices.getRootFolder(id)

        return User.findByIdAndUpdate(
            id,
            {$set: {usedSpace: rootFolder.size}},
            {new: true}
        )
    }


}

export default new UserService()