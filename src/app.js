const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos'))
.catch((err) => console.log('Error al conectar la base de datos', err));

app.get('/', (req, res) => {
    res.send('API CLINICA VORTEX');
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando http://localhost:${PORT}`);  
});