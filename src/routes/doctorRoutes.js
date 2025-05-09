const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  disableDoctor,
} = require("../controllers/doctorController");

const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", disableDoctor);

module.exports = router;
