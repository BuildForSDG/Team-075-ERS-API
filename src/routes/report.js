const express = require('express');
const { reportValidation } = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.post('/', auth, reportValidation, reportCtrl.createReport);
router.get('/', auth, reportCtrl.getReports);

module.exports = router;
