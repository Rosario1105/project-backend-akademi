const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      match: [/^[a-zA-Z\s]+$/, "Nombre inválido. Solo letras y espacios."],
      minlength: [8, "El nombre debe tener al menos 8 caracteres."],
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{7,9}$/, "DNI inválido. Debe tener entre 7 y 9 dígitos."],
    },
    coverage: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email inválido."],
    },
    birthDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          const m = today.getMonth() - date.getMonth();
          return age > 18 || (age === 18 && m >= 0);
        },
        message: "Debe ser mayor de edad.",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
