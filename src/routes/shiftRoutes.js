const express = require("express");
const router = express.Router();
const {
  createShift,
  getShifts,
  updateShiftState,
  getShiftById,
} = require("../controllers/shiftController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
router.get("/", getShifts);
router.get("/:id", getShiftById);
router.post("/", createShift);
router.patch("/:id/state", updateShiftState);

module.exports = router;
