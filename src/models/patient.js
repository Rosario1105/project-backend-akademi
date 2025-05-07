const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    medicalCoverage: { type: String, required: true},
    phone : { type: String },
    email: { type: String},
    address: { type: String },
    birthdate: { type: Date},
    isActive: {type: Boolean, defaulte: true}
}, { timestamps: true});

module.exports = moongose.model('Patient', patientSchema);