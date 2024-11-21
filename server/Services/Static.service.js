import {staticDir} from "../static/staticDir.js";
import * as Uuid from "uuid";
import path from "path";

class StaticService {
    async upload(file) {
        return await this.fileMove(file)
    }

    fileMove(file) {
        return new Promise((resolve, reject) => {
            const name = Uuid.v4() + '.' + file.name.split('.').pop()
            file.mv(`${staticDir}/${name}`, (err) => {
                if (err) {
                    reject(err)
                }
                resolve(`/static/${name}`)
            })
        })
    }

}

export default new StaticService()