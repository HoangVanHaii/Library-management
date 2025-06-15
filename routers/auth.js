const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')
const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')

router.post('/register/SendOTP',ValidateInput.UserRegister, userController.RegisterSendOTP);
router.post('/register/verifyOTP', ValidateInput.VerifyOTP, userController.RegisterVerify);
router.post('/login', ValidateInput.UserLogin, userController.UserLogin)
router.post('/changePass/sendOTP', userController.forgetPassSendOtp);
router.post('/changePass/verifyOTP', userController.forgetPassVerifyOtp)
router.get('/logout', verifyToken.verifyToken, userController.Logout);
router.post('/refreshToken', ValidateInput.refreshTokenData, userController.refreshToken);
module.exports = router;