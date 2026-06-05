const express = require('express');
const { checkout } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/checkout', checkout);

module.exports = router;
