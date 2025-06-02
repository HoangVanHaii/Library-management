const express = require('express');
const router = express.Router();

const borrowController = require('../controllers/borrowController')

const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')
const isAdmin = verifyToken.verifyAdmin;
const isUser = verifyToken.verifyUser
const validToken = verifyToken.verifyToken;

//Router dành cho borrow
router.get('/', validToken, isAdmin, borrowController.getAllUserBorrowBooks);
router.get('/me', validToken, isUser, borrowController.getBorrowOfme);
router.get('/users/:id',validToken ,isAdmin, borrowController.GetBorrowByUserID);
router.post('/', validToken, isUser, ValidateInput.BorrowData, borrowController.CreateNewBorrows);
router.put('/return/:idBorrow', validToken, isUser, borrowController.returnBook);
router.delete('/:idBorrow', validToken, isAdmin, borrowController.DeleteBorrow)

module.exports = router;