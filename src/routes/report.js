const express = require('express');
const { reportValidation, responseUnitLocationValidation } = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.get('/', auth('admin'), reportCtrl.getReports);
router.get('/:id', auth('admin'), reportCtrl.getReport);
router.get('/eru-location', auth('admin'), reportCtrl.getResponseUnitsLocation);
router.post('/:id', auth(['admin', 'user']), reportValidation, reportCtrl.modifyReport);
router.post('/', auth(['admin', 'user']), reportValidation, reportCtrl.createReport);
router.post('/eru-location', auth('admin'), responseUnitLocationValidation, reportCtrl.storeResponseUnitLocation);

module.exports = router;
