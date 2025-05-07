const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    specialty: { type: String, required: true },
    license: { type: String, required: true , unique: true},
    phone: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('Doctor', doctorSchema);