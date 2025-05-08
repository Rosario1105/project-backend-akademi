const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    patient: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Patient', 
         required: true },
    doctor: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Doctor',
           required: true },
    date: { 
        type: Date,
         required: true },
    reason: { 
        type: String, 
        required: true},
    state: { 
        type: String, 
        enum:['Earring', 'Done', 'Canceled'], 
        default:'Earring'}
}, {timestamps: true});

module.exports = mongoose.model('Shift', shiftSchema);