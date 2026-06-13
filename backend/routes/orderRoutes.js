const express = require('express');
const { checkout, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/checkout', authorize('customer'), checkout);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
