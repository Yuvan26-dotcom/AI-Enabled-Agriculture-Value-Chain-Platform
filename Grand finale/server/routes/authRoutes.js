const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/user', auth, authController.getUser);
router.post('/agristack-lookup', authController.fetchAgriStackData);

module.exports = router;