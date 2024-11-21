import {validationResult} from "express-validator";
import UserService from "../Services/User.service.js";
import FolderServices from "../Services/Folder.services.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import StaticService from "../Services/Static.service.js";

class UserController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Некорректные данные', errors})
            }
            const {email, password} = req.body

            const candidate = await UserService.getByEmail(email)
            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }

            const newUser = await UserService.register(email, password)

            await FolderServices.createRootFolder(newUser._id.toString())

            res.status(200).json({message: 'Пользователь создан', newUser})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка сервера'});
        }

    }

    async login(req, res) {
        try {
            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(404).json({message: "неверный логин или пароль"})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(404).json({message: "неверный логин или пароль"})
            }

            const token = jwt.sign(
                {userId: user.id},
                process.env.JWT_SECRET,
                {expiresIn: '24h'}
            )

            return res.status(200).json({
                token, user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка сервера'});
        }
    }

    async getUser(req, res) {
        try {
            const token = jwt.sign(
                {userId: req.userId},
                process.env.JWT_SECRET,
                {expiresIn: '24h'}
            )

            return res.status(200).json({
                token, user: req.user
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка сервера'});
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            file.name = decodeURIComponent(escape(file.name));
            const path = await StaticService.upload(file)

           const userUpdated = await User.findOneAndUpdate({_id: req.userId}, {avatar: path}, {new: true})

            res.status(200).json(userUpdated)
        } catch (e) {
            res.status(500).json({message: 'Error server', error: e.message})
            console.error(e)
        }
    }
}

export default new UserController()