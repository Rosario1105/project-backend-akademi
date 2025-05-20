const Shift = require("../models/Shift");
const Doctor = require("../models/Doctor");

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ msg: " Error al crear doctor", error: error.message });
  }
};

const getDoctors = async (req, res) => {
  const { specialty } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};

  if (specialty) {
    filters.specialty = new RegExp(specialty, "i");
  }

  try {
    const doctors = await Doctor.find(filters).skip(skip).limit(limit);
    const total = await Doctor.countDocuments(filters);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      results: doctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener doctores", error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ msg: "Doctor no encontrado" });
    res.json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener doctor", error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doctor) return res.status(404).json({ msg: "Doctor no encontrado" });
    res.json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar doctor", error: error.message });
  }
};

const disableDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ msg: "Doctor no encontrado" });

    const pendingShifts = await Shift.find({
      doctor: req.params.id,
      state: "Earring",
    });
    if (pendingShifts.length > 0) {
      return res
        .status(400)
        .json({
          msg: "No se puede inhabilitar un doctor con turnos pendientes",
        });
    }

    doctor.isActive = false;
    await doctor.save();

    res.json({ msg: "Doctor inhabilitado", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al inhabilitar doctor", error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  disableDoctor,
};
