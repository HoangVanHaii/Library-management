const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')
const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')

router.post('/register/SendOTP',ValidateInput.UserRegister, userController.RegisterSendOTP);
router.post('/register/verifyOTP', ValidateInput.VerifyOTP, userController.RegisterVerify);
router.post('/login', ValidateInput.UserLogin, userController.UserLogin)
router.get('/logout', verifyToken.verifyToken, userController.Logout);

module.exports = router;