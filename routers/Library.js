const express = require('express');
const router = express.Router();

//Controler cho các đối tượng
const bookControler = require('../Controller/bookLibrary');
const borrowControler = require('../Controller/borowLibrary')
const userControler = require('../Controller/userLibrary')

const ValidateInput = require('../MiddleWare/ValidateInput');
const verifyToken = require('../MiddleWare/ValidateToken')
const isAdmin = verifyToken.verifyAdmin;
const isUser = verifyToken.verifyUser
const validToken = verifyToken.verifyToken;

//Router dành cho book
router.get('/books',validToken, isUser, bookControler.getAllBooks);
router.get('/books/available',validToken ,isUser, bookControler.getBookAvailable);
router.get('/books/:id',validToken,isUser, bookControler.getBookById);
router.post('/books', validToken, isAdmin,ValidateInput.BookData ,bookControler.CreateNewBooks);
router.put('/books/:id',validToken , isAdmin , ValidateInput.BookData ,bookControler.UpdateBookById);
router.delete('/books',validToken, isAdmin,bookControler.DeleteAllBook)
router.delete('/books/:id',validToken,isAdmin, bookControler.DeleteBookByID);

//Router dành cho user
router.get('/users',isAdmin, userControler.GetAllUsers);
router.get('/users/:id',isAdmin, userControler.GetUsersById);
router.post('/users/',isAdmin, ValidateInput.UserRegister, userControler.CreateNewUser);
router.post('/users/register',ValidateInput.UserRegister, userControler.UserRegister);
router.put('/users/:id',isAdmin, ValidateInput.UserRegister, userControler.UpdateUserById); 
router.delete('/users/:id',isAdmin, userControler.DeleteUserById);
router.post('/users/login', ValidateInput.UserLogin, userControler.UserLogin)

//Router dành cho borrow
router.get('/borrows', validToken, isAdmin, borrowControler.getAllUserBorrowBooks);
router.get('/borrows/me', validToken, isUser, borrowControler.getBorrowOfme);
router.get('/borrows/users/:id',validToken ,isAdmin, borrowControler.GetBorrowByUserID);
router.post('/borrows', validToken, isUser, ValidateInput.BorrowData, borrowControler.CreateNewBorrows);
router.put('/borrows/return/:idBorrow', validToken, isUser, borrowControler.returnBook);
router.delete('/borrows/:idBorrow', validToken, isAdmin, borrowControler.DeleteBorrow)

module.exports = router;