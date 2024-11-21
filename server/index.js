import express from 'express'
import dotenv from 'dotenv'
import {connectMongo} from "./db.js";
import AuthRouter from "./routes/auth.routes.js";
import FolderRouter from "./routes/folder.routes.js";
import cors from 'cors'
import fileUpload from 'express-fileupload';
import router from "./routes/router.js";
dotenv.config()

const app = express()

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(fileUpload());
app.use(express.json())
app.use('/static', express.static('static'));
app.use((req, res, next) => {
    console.log(`Запрос: ${req.method} ${req.path}`);
    next();
});
app.use('/api', router)

const start = async () => {
    try {
        const port = process.env.PORT || 5000
        await connectMongo()
        await app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (e) {
        console.log(e)
        console.log('RESTART SERVER')
        start()
    }

}

start()

