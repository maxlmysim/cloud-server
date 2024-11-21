export function filePresenceRequst (req, res, next)  {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded', req: req.body, file: req.files });
    }
    next();
};