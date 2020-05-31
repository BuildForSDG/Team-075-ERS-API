const express = require('express');
const { reportValidation, responseUnitLocationValidation } = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.get('/', auth, reportCtrl.getReports);
router.post('/', auth, reportValidation, reportCtrl.createReport);
router.post('/eru-location', responseUnitLocationValidation, reportCtrl.storeResponseUnitLocation);
router.get('/eru-location', reportCtrl.getResponseUnitsLocation);

module.exports = router;
