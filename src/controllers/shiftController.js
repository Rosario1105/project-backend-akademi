const Shift = require('../models/shift');
const Doctor = require('../models/Doctor');

const createShift = async (req, res) =>{
    try{
        const { patient, doctor, date, reason } = req.body;

        if(!patient || !doctor || !date || !reason){
            return res.status(400).json({ msg: 'Todos los campos son obligatorios'});
        }

        const shiftDate = new Date(date);

        const doctorFound = await Doctor.findById(doctor);
        if(!doctorFound || !doctorFound.isActive){
            return res.status(400).json({ msg: 'Doctor invalido o inactivo'});
        }

        const existing = await Shift.findOne({ doctor, date:shiftDate});
        if(existing){
            return res.status(400).json({ msg: 'El doctor ya tiene un turno en ese horario'});
        }

        const shift = await Shift.create({ patient, doctor, date:shiftDate, reason});

        res.status(201).json({ msg: 'Turno creado con exito', shift});
    } catch (error){
        res.status(500).json( {msg: 'Error al crear turno', error: error.message});
    }
}

const getShifts = async (req, res) => {
    const { patient, doctor } = req.query;

    if(!patient && !doctor) {
        return res.status(400).json({ msg: 'Debe proporcionar al menos un paciente o doctor'});
    }

    const filters = {};
    if(patient) filters.patient = patient;
    if(doctor) filters.doctor = doctor;

    try{
        const shifts = await Shift.find(filters)
        .populate('patient', 'name dni')
        .populate('doctor', 'name specialty')
        .sort({date: 1});

        res.json(shifts);
    } catch (error){
        res.status(500).json({ msg: 'Error al obtener los turnos', error: error.message});
    }
}

const updateShiftState = async (req, res) =>{
    const { state } = req.body;
    const allowedStates =  ['Earring', 'Done', 'Canceled'];

    if(!allowedStates.includes(state)){
        return res.status(400).json({ msg: 'Estado invalido. Solo se permite: Earring, Done, Canceled'});
    }

    try {
        const shift = await Shift.findByIdAndUpdate(
            req.params.id,
            { state },
            { new: true }
        );

        if(!shift){
            return res.status(404).json({msg: 'Turno no encontrado'});
        }

        res.json({ msg: `'Estado del turno actualizado a'${state}`, shift})
    } catch (error){
        res.status(500).json({msg: 'Error al actualizar el estado del turno', error: error.message});
    }
}



module.exports = {
    createShift,
    getShifts,
    updateShiftState
}

