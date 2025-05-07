const express = require('express');
const router = express.Router();

const{
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

const { protect , adminOnly } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;