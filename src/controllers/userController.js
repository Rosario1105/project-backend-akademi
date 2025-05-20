const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

 
     try {
       const users = await User.find({}).skip(skip).limit(limit);
       const total = await User.countDocuments({});
   
       res.json({
         total,
         page,
         totalPages: Math.ceil(total / limit),
         results: users,
       });
     } catch (error) {
       res
         .status(500)
         .json({ msg: "Error al obtener pacientes", error: error.message });
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

  if(!name || !email || !password || !role){
    return res.status(400).json({msg: 'Todos los campos son obligatorios'});
  }

  
  if (name.trim().length < 8) {
  return res.status(400).json({ msg: 'El nombre debe tener al menos 8 caracteres' });
}
  

if(!email.includes('@') || !email.includes('.')){
  return res.status(400).json({msg: 'Email invalido'});
}

if (!password || password.trim().length < 8) {
  return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres reales' });
}

const validRoles = ['admin', 'recepcion'];
if(!validRoles.includes(role)){
  return res.status(400).json({msg: 'Rol invalido. Debe ser "admin" o "recepcion"'});
  
}

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "El usuario ya existe" });

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

  const validRoles = ['admin', 'recepcion'];
  if(!validRoles.includes(role)){
        return res.status(400).json({msg: 'Rol invalido. Debe ser "admin" o "recepcion"'});

  }

  if(!email.includes('@') || !email.includes('.')){
    return res.status(400).json({msg: 'Email invalido'});
  }

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
