const mongoose = require("mongoose");

const isValidShiftTime = (date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return hour >= 10 && hour < 18 && (minutes === 0 || minutes === 30);
};

const shiftSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: isValidShiftTime,
        message:
          "El horario debe ser entre 10:00 y 18:00 en intervalos de 30 minutos.",
      },
    },
    reason: {
      type: String,
      required: true,
      minlength: [10, "El motivo debe tener al menos 10 caracteres."],
      maxlength: [200, "El motivo no debe superar los 200 caracteres."],
    },
    state: {
      type: String,
      enum: ["Earring", "Done", "Canceled"],
      default: "Earring",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Shift || mongoose.model("Shift", shiftSchema);
