const Shift = require("../models/Shift");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const sendEmail = require("../utils/sendEmails");

const createShift = async (req, res) => {

  
    try {
      const { patient, doctor, date, reason } = req.body;
  
      if (!patient || !doctor || !date || !reason) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
      }

      
      const shiftDate = new Date(date);
      const now = new Date();
      if (shiftDate < now) {
        return res
        .status(400)
        .json({ msg: "No se puede crear un turno en una fecha pasada" });
      }
      
     if (isNaN(shiftDate.getTime())) {
       return res.status(400).json({ msg: "Fecha inválida" });
     }
  
    const hour = shiftDate.getHours();
    const minutes = shiftDate.getMinutes();
    if (
      hour < 10 || hour >= 18 ||
      (minutes !== 0 && minutes !== 30)
    ) {
      return res.status(400).json({
        msg: "El turno debe ser entre las 10:00 y las 18:00, en intervalos de 30 minutos",
      });
    }

     if (reason.trim().length < 10 || reason.trim().length > 200) {
      return res.status(400).json({
        msg: "El motivo debe tener entre 10 y 200 caracteres",
      });
    }


      const patientFound = await Patient.findById(patient);
      if (!patientFound || !patientFound.isActive) {
        return res.status(400).json({ msg: "Paciente invalido o inactivo" });
      }
  
      const doctorFound = await Doctor.findById(doctor);
      if (!doctorFound || !doctorFound.isActive) {
        return res.status(400).json({ msg: "Doctor invalido o inactivo" });
      }
  
      const duplicate = await Shift.findOne({ patient, date: shiftDate });
      if (duplicate) {
        return res
          .status(400)
          .json({ msg: "El paciente ya tiene un turno en ese horario" });
      }
  
      const existing = await Shift.findOne({ doctor, date: shiftDate });
      if (existing) {
        return res
          .status(400)
          .json({ msg: "El doctor ya tiene un turno en ese horario" });
      }
  
      const start = new Date(shiftDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(shiftDate);
      end.setHours(23, 59, 59, 999);
  
      const doctorShifts = await Shift.countDocuments({
        doctor,
        date: { $gte: start, $lte: end },
      });
  
      if (doctorShifts >= 10) {
        return res
          .status(400)
          .json({ msg: "El doctor ya tiene el máximo de 10 turnos ese día" });
      }
  
      const shift = await Shift.create({
        patient,
        doctor,
        date: shiftDate,
        reason,
      });
  
      await shift.populate("patient");
      await shift.populate("doctor");
  

      await sendEmail(
        shift.patient.email,
        "Confirmación de turno - Clínica Vortex",
        `
          <h2>Hola ${shift.patient.name},</h2>
          <p>Tu turno fue confirmado con el Dr. <strong>${shift.doctor.name}</strong>.</p>
          <p><strong>Fecha:</strong> ${new Date(shift.date).toLocaleString("es-AR")}</p>
          <p><strong>Motivo:</strong> ${shift.reason}</p>
          <hr />
          <p>Clínica Vortex - Gracias por confiar en nosotros.</p>
        `
      );
  
      res.status(201).json({ msg: "Turno creado con éxito", shift });
    } catch (error) {
      res.status(500).json({ msg: "Error al crear turno", error: error.message });
    }
  };

const getShifts = async (req, res) => {
  const { patient, doctor } = req.query;

  const filters = {};
  if (patient) filters.patient = patient;
  if (doctor) filters.doctor = doctor;

  try {
    const shifts = await Shift.find(filters)
      .populate("patient", "name dni")
      .populate("doctor", "name specialty")
      .sort({ date: 1 });

    res.json(shifts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener los turnos", error: error.message });
  }
};

const getShiftById = async (req, res) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findById(id)
      .populate("patient", "name dni")
      .populate("doctor", "name specialty");

    if (!shift) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }

    res.json(shift);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener el turno", error: error.message });
  }
};

const updateShiftState = async (req, res) => {
  const { state } = req.body;
  const allowedStates = ["Earring", "Done", "Canceled"];

  if (!allowedStates.includes(state)) {
    return res.status(400).json({
      msg: "Estado invalido. Solo se permite: Earring, Done, Canceled",
    });
  }

  try {
    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { state },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }

    res.json({ msg: `'Estado del turno actualizado a'${state}`, shift });
  } catch (error) {
    res.status(500).json({
      msg: "Error al actualizar el estado del turno",
      error: error.message,
    });
  }
};

module.exports = {
  createShift,
  getShifts,
  updateShiftState,
  getShiftById,
};
