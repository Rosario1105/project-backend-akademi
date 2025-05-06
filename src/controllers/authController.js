const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

module.exports = { registerUser, loginUser };
