const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const ValidateInput = require('../middlewares/validateInput');
const verifyToken = require('../middlewares/validateToken')
const isAdmin = verifyToken.verifyAdmin;
const isUser = verifyToken.verifyUser
const validToken = verifyToken.verifyToken;

//Router dành cho book
router.get('/', bookController.getAllBooks);
router.get('/available',validToken ,isUser, bookController.getBookAvailable);
router.get('/top10', bookController.getTop10sale);
router.get('/flashSale', bookController.getBookFlashSale);
router.post('/search', bookController.searchBook);
router.get('/:id', bookController.getBookById);
router.post('/', validToken, isAdmin,ValidateInput.BookData ,bookController.CreateNewBooks);
router.put('/setTimeFlashSale', bookController.setTimeSale);
router.put('/:id', validToken , isAdmin  ,bookController.UpdateBookById);
router.delete('/', validToken, isAdmin, bookController.DeleteBookByID);
// router.delete('/',validToken, isAdmin,bookController.DeleteAllBook)

module.exports = router;
