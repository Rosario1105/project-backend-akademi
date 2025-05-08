const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    coverage: { type: String, required: true},
    phone : { type: String },
    email: { type: String},
    address: { type: String },
    birthdate: { type: Date},
    isActive: {type: Boolean, default: true}
}, { timestamps: true});

module.exports = mongoose.model('Patient', patientSchema);