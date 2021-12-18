const express = require('express');
const authController =  require('../middleware/authController');
const auth = require('../controllers/authController');
const router = express.Router();

router.get('/auth', authController.isLoggedIn);
router.get('/authApi', auth.isLoggedIn);

module.exports = router ;