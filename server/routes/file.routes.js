import {Router} from 'express'
import authMiddleware from "../middleware/auth.middleware.js";
import FileController from "../controllers/File.controller.js";
import {checkStorageLimit} from "../middleware/checkStorageLimit.middleware.js";
import {filePresenceRequst} from "../middleware/filePresenceRequst.middleware.js";

const router = new Router()

router.post('/upload', [authMiddleware, filePresenceRequst, checkStorageLimit], FileController.upload)
router.delete('/', [authMiddleware], FileController.delete)
router.get('', [authMiddleware], FileController.download)

export default router