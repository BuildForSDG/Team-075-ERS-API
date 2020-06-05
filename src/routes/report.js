const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const requestFromQueryMiddleware = require('../middleware/queryMiddleware');
const { reportValidation, locationValidation, responseUnitLocationValidation } = require('../middleware/validationMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.get('/', auth('admin'), reportCtrl.getReports);
router.get('/:id', auth(['admin', 'user']), reportCtrl.getReport);
router.get('/eru-location', reportCtrl.getResponseUnitsLocation);
router.get('/location/nearest-eru',
  requestFromQueryMiddleware, locationValidation, reportCtrl.getClosestResponseUnit);
router.post('/:id', auth(['admin', 'user']), reportValidation, reportCtrl.modifyReport);
router.post('/', auth(['admin', 'user']), reportValidation, reportCtrl.createReport);
router.post('/eru-location', auth('admin'), responseUnitLocationValidation, reportCtrl.storeResponseUnitLocation);
router.post('/location/nearest-eru', locationValidation, reportCtrl.getClosestResponseUnit);

module.exports = router;
