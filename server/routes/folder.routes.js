import {Router} from "express";
import FolderController from "../controllers/Folder.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = new Router()

router.post('/', [authMiddleware], FolderController.get)
router.post('/create', [authMiddleware], FolderController.create)
router.delete('/', [authMiddleware], FolderController.delete)

export default router