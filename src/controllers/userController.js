const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener usuarios", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al buscar usuario", error: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ mgs: "El usuario ya existe" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al crear usuario", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { name, email, role, isActive } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = typeof isActive === "boolean" ? isActive : user.isActive;

    await user.save();

    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar el usuario", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar el usuario", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
