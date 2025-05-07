const Patient = require('../models/Patient');

const createPatient = asycn (req, res) => {
    try{
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (error){
        res.status(500).json({ msg: 'Error al crear paciente', error: error.message});
    }
};

const getPatients = async (req,res) => {
    try{
        const patients = await Patient.find();
        res.json(patients);
    } catch (error){
        res.status(500).json({ msg: 'Error al obtener pacientes', error: error.message});
    }
};

const getPatientById = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if(!patient) return res.status(404).json({ msg: 'Paciente no encontrado'});
        res.json(patient);
    } catch (error){
        res.status(500).json({ msg: 'Error al obtener paciente', error: error.message});
    }
};

const updatePatient = async (req, res)=>{
    try{
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!patient) return res.status(404).json({ msg: 'Paciente no encontrado'});
        res.json(patient);
    } catch(error){
        res.status(500).json({ msg: 'Error al actualizar paciente', error: error.message});
    }
};

const deletePatient = async (req, res) => {
    try{
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if(!patient) return res.status(404).json({ msg: 'Paciente no encontrado'});
        res.json({ msg: 'Paciente eliminado correctamente'});
    } catch (error){
        res.status(500).json({ mgs: 'Error al eliminar paciente', error: error.message});
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
}