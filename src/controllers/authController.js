const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const recoverPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(404).json({ msg: "Usuario no encontrado o inactivo" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 60;

    await user.save();

    const resetLink = `http://localhost:7000/reset-password/${resetToken}`;

    const html = `
        <h2>Recuperación de contraseña</h2>
        <p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
      `;

    await sendEmail(user.email, "Recuperación de contraseña - AKADEMI", html);

    res.json({ message: "Correo enviado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al procesar la solicitud",
        error: error.message,
      });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al restablecer la contraseña",
        error: error.message,
      });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encotrado" });

    if (!user.isActive)
      return res
        .status(403)
        .json({ message: "Usuario inactivo, comuniquese con el admin" });

    const equals = await bcrypt.compare(password, user.password);
    if (!equals)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "El usuario ya existe" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

module.exports = { registerUser, loginUser, recoverPasswordRequest, resetPassword};
