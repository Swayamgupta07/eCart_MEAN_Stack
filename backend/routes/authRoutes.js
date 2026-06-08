const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');

router.post('/register', validateRequest('register'), register);
router.post('/login', validateRequest('login'), login);
router.get('/me', protect, getMe);

module.exports = router;
