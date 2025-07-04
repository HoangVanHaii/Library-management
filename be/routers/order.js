const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/validateToken');
const orderController = require('../controllers/orderController')

router.get('/me', verifyToken.verifyToken, orderController.getOrderOfme);
router.get('/:id', orderController.getbookOrderedByid);
router.post('/', verifyToken.verifyToken, orderController.createOrder);
router.post('/sendMail', orderController.SenMailToNews)
// router.post('/flashSale', verifyToken.verifyToken, orderController.createOrderFlashSale);
module.exports = router;
