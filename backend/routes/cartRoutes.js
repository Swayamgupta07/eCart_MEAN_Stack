const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addToCart, 
    saveForLater, 
    moveToCart, 
    removeFromCart 
} = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');

router.use(protect);

router.get('/', getCart);
router.post('/add', validateRequest('addToCart'), addToCart);
router.post('/save-later/:productId', saveForLater);
router.post('/move-to-cart/:productId', moveToCart);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;
