import AuthRouter from "./auth.routes.js";
import FolderRouter from "./folder.routes.js";
import FileRouter from "./file.routes.js";
import UserRouter from "./user.routes.js";
import {Router} from "express";

const router = new Router()

router.use('/auth', AuthRouter)
router.use('/folder', FolderRouter)
router.use('/files', FileRouter)
router.use('/user', UserRouter)

export default router