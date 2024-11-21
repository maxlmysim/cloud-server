import {Router} from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import UserController from "../controllers/User.controller.js";
import {check} from "express-validator";

const router = new Router()

router.post('/avatar', [authMiddleware], UserController.uploadAvatar)

export default router
