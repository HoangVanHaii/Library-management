const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/validateToken');
const { upload, uploadImage } = require('../controllers/bookUploadController');
const { uploadUser, saveFileUser} = require('../controllers/userUploadController');

router.post('/user', verifyToken, uploadUser.single('image'),saveFileUser )
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
