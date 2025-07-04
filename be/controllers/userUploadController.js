const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:'./upload/user',
    filename:(req, file, cb) => {
        const newname = `${req.user.userName}${path.extname(file.originalname)}`
        cb(null, file.originalname);
    }
})

const uploadUser = multer({storage});
const saveFileUser = (req, res) => {
    try {
        if(!req.file){
            res.status(400).send({message:"Không up load được ảnh"});
        }
        console.log(req.file);
        res.json({
            message: "đã upload file",
            file: req.file.filename
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Server k ổn định"})
    }
}
module.exports = {uploadUser, saveFileUser};