require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');


connectDB();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API CLINICA VORTEX');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando http://localhost:${PORT}`);  
});
