require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos'))
.catch((err) => console.log('Error al conectar la base de datos', err));

app.get('/', (req, res) => {
    res.send('API CLINICA VORTEX');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando http://localhost:${PORT}`);  
});
