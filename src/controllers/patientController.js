const Patient = require('../models/Patient');

const createPatient = async (req, res) => {
    const { dni, name, coverage } = req.doby;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    if(!dni && !name && !coverage){
        return res.status(400).json({
            msg:'Debes colocar al menos uno de los filtros: name, dni o coverage'
        });
    }

    const filters = {};

    if(dni) filters.dni = dni;
    if(name) filters.name = new RegExp(name, 'i');
    if(coverage) filters.coverage = new RegExp(coverage, 'i');


    try{
        const patients = await Patient.find(filters).skip(skip).limit(limit);
        const total = await Patient.countDocuments(filters);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total/ limit),
            results: patients,
        });
    } catch(error){
        res.status(500).json({ msg: 'Error al obtener pacientes', error: error.message});
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
        res.status(500).json({ msg: 'Error al eliminar paciente', error: error.message});
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
}