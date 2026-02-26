const express = require('express');
const { register, login, loginAdmin, loginUser, me } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login/admin', loginAdmin);
router.post('/login/user', loginUser);
router.get('/me', auth, me);

module.exports = router;
