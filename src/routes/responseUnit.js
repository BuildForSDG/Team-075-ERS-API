const express = require('express');
const auth = require('../middleware/authMiddleware');
const { responseUnitValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const responseUnitCtrl = require('../controllers/responseUnitController');

router.post('/signup', responseUnitValidation, responseUnitCtrl.signup);
router.post('/login', responseUnitCtrl.login);
router.post('/:id', auth('admin'), responseUnitCtrl.updateResponseUnit);
router.get('/:id', auth('admin'), responseUnitCtrl.getResponseUnit);
router.get('/', auth('admin'), responseUnitCtrl.getAllResponseUnits);

module.exports = router;
