const express = require('express');
const router = express.Router();
const{
    createShift,
    getShifts,
    updateShiftState
} = require('../controllers/shiftController');

const {protect} = require('../middlewares/authMiddleware');


router.use(protect);
router.get('/', getShifts);
router.post('/', createShift);
router.patch('/:id/state', updateShiftState);


module.exports = router;