const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const { reportValidation } = require('../middleware/validationMiddleware');
const reportCtrl = require('../controllers/reportController');

const router = express.Router();

router.get('/', auth('admin'), reportCtrl.getReports);
router.get('/id/:id', auth(['admin', 'user']), reportCtrl.getReport);
router.post('/id/:id', auth(['admin', 'user']), reportValidation, reportCtrl.modifyReport);
router.post('/', auth(['admin', 'user']), reportValidation, reportCtrl.createReport);

module.exports = router;
