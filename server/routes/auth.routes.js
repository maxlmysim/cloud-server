import {Router} from 'express'
import {check, validationResult} from 'express-validator'
import authMiddleware from "../middleware/auth.middleware.js";
import UserController from "../controllers/User.controller.js";

const router = new Router()

router.post('/register',
    [
        // check('email', 'Некорректный email').isEmail(),
        check('password', 'Пароль должен быть не менее 3 символов и не более 12').isLength({min: 3, max: 12})
    ],
    UserController.register)

router.post('/login',
    [],
    UserController.login)

router.get('',
    [authMiddleware],
    UserController.getUser)

export default router