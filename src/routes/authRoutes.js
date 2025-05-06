const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, adminOnly } = require ('../middlewares/authMiddleware'); 

router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
