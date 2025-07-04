const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './upload/book',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // bạn có thể thay đổi thành unique name nếu muốn
  }
});

const upload = multer({ storage });

// Controller xử lý upload
const uploadImage = (req, res) => {
  const file = req.body; 
  try {
        if(!req.file){
            return res.status(400).json({ message: 'Không có file được upload' });
        }
        res.json({
            message: 'Upload thành công',
            file: req.file.filename
        });
   } catch (error) {
        console.error(error);
   }
};

module.exports = {
  upload,
  uploadImage
};
