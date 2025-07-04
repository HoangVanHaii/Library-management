const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
const verifyToken = require('../middlewares/validateToken');

router.get('/cartShop/me', verifyToken.verifyToken, cartController.getCartShop);
router.post('/addCart', verifyToken.verifyToken, cartController.cartShop);
router.delete('/delete', verifyToken.verifyToken, cartController.deleteCartShopping)
module.exports = router;