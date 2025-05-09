const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio "],
      match: [/^[a-zA-Z\s]+$/, "Nombre inválido. Solo letras y espacios."],
      minlength: [8, "El nombre debe tener al menos 8 caracteres."],
    },
    specialty: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z\s]+$/,
        "Especialidad inválida. Solo letras y espacios.",
      ],
      minlength: [8, "La especialidad debe tener al menos 8 caracteres."],
    },
    license: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^\+?\d{10,15}$/,
        "Número de celular inválido. Debe tener entre 10 y 15 dígitos. Puede comenzar con +.",
      ],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email inválido."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
