const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");


router.get("/", protect, adminOnly, getAllUsers);
router.post("/", protect, adminOnly, createUser);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
