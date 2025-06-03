const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')
const isAdmin = verifyToken.verifyAdmin;
const isUser = verifyToken.verifyUser
const validToken = verifyToken.verifyToken;

//Router dành cho book
router.get('/',validToken, isUser, bookController.getAllBooks);
router.get('/available',validToken ,isUser, bookController.getBookAvailable);
router.get('/:id',validToken,isUser, bookController.getBookById);
router.post('/', validToken, isAdmin,ValidateInput.BookData ,bookController.CreateNewBooks);
router.put('/:id',validToken , isAdmin , ValidateInput.BookData ,bookController.UpdateBookById);
router.delete('/',validToken, isAdmin,bookController.DeleteAllBook)
router.delete('/:id', validToken, isAdmin, bookController.DeleteBookByID);

module.exports = router;
