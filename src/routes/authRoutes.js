const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  recoverPasswordRequest,
  resetPassword,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser, protect, adminOnly);
router.post("/recover", recoverPasswordRequest);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
