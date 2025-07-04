const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')
const isAdmin = verifyToken.verifyAdmin;
const validToken = verifyToken.verifyToken;

//Router dành cho user
router.get('/me', validToken, userController.informationOfme);
router.get('/', validToken, isAdmin, userController.GetAllUsers);
router.get('/:id', validToken, isAdmin, userController.GetUsersById);
router.post('/', validToken, isAdmin, ValidateInput.UserRegister, userController.CreateNewUser);
router.post('/changeAvt', validToken, userController.changeAvatar);
router.put('/:id', validToken, userController.UpdateUserById); 
router.delete('/:id', validToken,isAdmin, userController.DeleteUserById);

module.exports = router;
