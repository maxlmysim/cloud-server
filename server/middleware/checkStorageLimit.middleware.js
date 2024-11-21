export function checkStorageLimit(req, res, next) {
    try {
        const filesSize = [req.files.file].flat()
            .reduce((acc, file)=> acc + file.size, 0)

        if (filesSize <= (req.user.diskSpace - req.user.usedSpace)) {
            next()
        } else {
            return res.status(413).json({message: 'Not enough space'})
        }
    } catch (e) {
        res.status(500).json({message: 'Error server', error: e.message})
    }
}