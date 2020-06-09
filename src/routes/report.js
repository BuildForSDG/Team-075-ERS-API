const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const { reportValidation } = require('../middleware/validationMiddleware');
const reportCtrl = require('../controllers/reportController');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', auth('admin'), reportCtrl.getReports);
router.get('/id/:id', auth(['admin', 'user']), reportCtrl.getReport);
router.put('/id/:id', auth(['admin', 'user']), reportValidation, multer, reportCtrl.modifyReport);
router.post('/', auth(['admin', 'user']), reportValidation, reportCtrl.createReport);
router.post('/eye-witness', auth(['admin', 'user']), reportValidation, multer, reportCtrl.createReportAsWitness);


module.exports = router;
