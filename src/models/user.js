const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      match: [/^[a-zA-Z\s]+$/, "Nombre inválido. Solo letras y espacios."],
      minlength: [8, "El nombre debe tener al menos 8 caracteres."],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email inválido."],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      select: false,
      minlength: [8, "La contraseña debe tener al menos 8 caracteres."],
    },
    role: {
      type: String,
      enum: ["admin", "recepcion"],
      default: "recepcion",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
