const express = require('express');
const router = express.Router();

//Controller cho các đối tượng
const bookController = require('../Controller/bookLibrary');
const borrowController = require('../Controller/borowLibrary')
const userController = require('../Controller/userLibrary')

const ValidateInput = require('../MiddleWare/ValidateInput');
const verifyToken = require('../MiddleWare/ValidateToken')
const isAdmin = verifyToken.verifyAdmin;
const isUser = verifyToken.verifyUser
const validToken = verifyToken.verifyToken;

//Router dành cho book
router.get('/books',validToken, isUser, bookController.getAllBooks);
router.get('/books/available',validToken ,isUser, bookController.getBookAvailable);
router.get('/books/:id',validToken,isUser, bookController.getBookById);
router.post('/books', validToken, isAdmin,ValidateInput.BookData ,bookController.CreateNewBooks);
router.put('/books/:id',validToken , isAdmin , ValidateInput.BookData ,bookController.UpdateBookById);
router.delete('/books',validToken, isAdmin,bookController.DeleteAllBook)
router.delete('/books/:id',validToken,isAdmin, bookController.DeleteBookByID);

//Router dành cho user
router.get('/users', validToken, isAdmin, userController.GetAllUsers);
router.get('/users/logout', validToken, userController.Logout);
router.get('/users/:id', validToken, isAdmin, userController.GetUsersById);
router.post('/users', validToken, isAdmin, ValidateInput.UserRegister, userController.CreateNewUser);
router.post('/users/register/SendOTP',ValidateInput.UserRegister, userController.RegisterSendOTP);
router.post('/users/register/verifyOTP', ValidateInput.VerifyOTP, userController.RegisterVerify);
router.put('/users/:id', validToken, isAdmin, ValidateInput.UserRegister, userController.UpdateUserById); 
router.delete('/users/:id', validToken,isAdmin, userController.DeleteUserById);
router.post('/users/login', ValidateInput.UserLogin, userController.UserLogin)

//Router dành cho borrow
router.get('/borrows', validToken, isAdmin, borrowController.getAllUserBorrowBooks);
router.get('/borrows/me', validToken, isUser, borrowController.getBorrowOfme);
router.get('/borrows/users/:id',validToken ,isAdmin, borrowController.GetBorrowByUserID);
router.post('/borrows', validToken, isUser, ValidateInput.BorrowData, borrowController.CreateNewBorrows);
router.put('/borrows/return/:idBorrow', validToken, isUser, borrowController.returnBook);
router.delete('/borrows/:idBorrow', validToken, isAdmin, borrowController.DeleteBorrow)

module.exports = router;