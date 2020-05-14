const express = require('express');
const { reportValidation } = require('../middleware/validationMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.post('/', reportValidation, reportCtrl.createReport);
router.get('/', reportCtrl.getReports);

module.exports = router;
