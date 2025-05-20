const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
  const { dni, name, coverage, email, birthDate } = req.body;
  if (!dni && !name && !coverage) {
    return res.status(400).json({
      msg: "Debes colocar al menos uno de los filtros: name, dni o coverage",
    });
  }

  if (name.trim().length < 8 || !/^[a-zA-Z\s]+$/.test(name)) {
    return res
      .status(400)
      .json({
        msg: "Nombre invalido. Debe tener al menos 8 caracteres y solo letras",
      });
  }

  if (!/^\d{7,9}$/.test(dni)) {
    return res
      .status(400)
      .json({ msg: "DNI inválido. Debe tener entre 7 y 9 dígitos" });
  }

  if (coverage.trim().length < 3) {
    return res
      .status(400)
      .json({ msg: "La cobertura debe tener al menos 3 caracteres" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ msg: "Email inválido" });
  }
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const isOlder = age > 18 || (age === 18 && m >= 0);
  if (!isOlder) {
    return res.status(400).json({ msg: "El paciente debe ser mayor de edad" });
  }

  try {
    const exists = await Patient.findOne({ dni });
    if (exists) {
      return res
        .status(400)
        .json({ msg: "Ya existe un paciente con ese DNI " });
    }
    const patient = await Patient.create({
      dni,
      name,
      coverage,
      email,
      birthDate,
    });
    res.status(201).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al crear paciente", error: error.message });
  }
};

const getPatients = async (req, res) => {
  const { dni, name, coverage } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  if (dni) filters.dni = dni;
  if (name) filters.name = new RegExp(name, "i");
  if (coverage) filters.coverage = new RegExp(coverage, "i");

  try {
    const patients = await Patient.find(filters).skip(skip).limit(limit);
    const total = await Patient.countDocuments(filters);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      results: patients,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener pacientes", error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient)
      return res.status(404).json({ msg: "Paciente no encontrado" });
    res.json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener paciente", error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!patient)
      return res.status(404).json({ msg: "Paciente no encontrado" });
    res.json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar paciente", error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient)
      return res.status(404).json({ msg: "Paciente no encontrado" });
    res.json({ msg: "Paciente eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar paciente", error: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
