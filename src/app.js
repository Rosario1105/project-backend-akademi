require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
connectDB();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/shifts', shiftRoutes);

app.get('/', (req, res) => {
    res.send('API CLINICA VORTEX');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando http://localhost:${PORT}`);  
});
