const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  console.log(req.headers);
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalido" });
    }
  } else {
    return res.status(401).json({ message: "No autorizado, sin token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso solo permitido para administradores" });
  }
  next();
};

module.exports = { protect, adminOnly };
