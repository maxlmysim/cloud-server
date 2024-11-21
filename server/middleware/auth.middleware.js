import jwt from "jsonwebtoken";
import {config} from "dotenv";
import User from "../models/User.js";

config()

export default async function authMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Unauthorization'})
        }
        const userId = jwt.verify(token, process.env.JWT_SECRET).userId

        const user = await User.findById(userId).select('-password -__v -_id')
        if (!user) {
            return res.status(401).json({message: 'Unauthorization'})
        }

        req.user = user.toObject()
        req.userId = userId
        next()
    } catch (err) {
        return res.status(401).json({message: 'Unauthorization'})
    }

}