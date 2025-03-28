const express = require('express');
const { login, googleLogin, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getCurrentUser);

module.exports = router; 