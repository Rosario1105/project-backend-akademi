const jwt = require('jsonwebtoken');
const User = require('../models/User');

const triggerToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
};

exports.registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        const exist = await User.findOne({ email });
        if(exist) return res.status(400).json({msg: 'El usuario ya existe'});

        const usuario = new User({ name, email, password, role});
        await usuario.save();

        res.status(201).json({msg: 'Usuario registrado correctamente'});
    } catch(err){
        res.status(500).json({msg: 'Error en el servidor', error: err.message});
    }
};

exports.login = async (req, res) =>{
    try{
        const { email, password} = req.body;
        const user = await User.findOne({ email });

        if(!user) return res.status(404).json({ msg: 'Usuario no encontrado'});

        const isValid = await user.comparePassword(password);
        if(!isValid) return res.status(401).json({ msg: 'Credenciales invalidas'});

        const token = triggerToken(user);
        res.json({token, user: {id: user._id, name: user.name, role: user.role}});
       } catch (err){
        res.status(500).json({msg: 'Error en el servidor', error: err.message})
       }
};