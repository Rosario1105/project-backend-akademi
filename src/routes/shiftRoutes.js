const express = require('express');
const router = express.Router();
const{
    createShift,
    getShifts
} = require('../controllers/shiftController');

const {protect} = require('../middlewares/authMiddleware');


router.use(protect);

router.get('/', getShifts);

router.post('/', createShift);

module.exports = router;