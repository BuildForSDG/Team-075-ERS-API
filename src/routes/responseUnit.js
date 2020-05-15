const express = require('express');
const auth = require('../middleware/authMiddleware');
const { responseUnitValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const responseUnitCtrl = require('../controllers/responseUnitController');

router.post('/signup', responseUnitValidation, responseUnitCtrl.signup);
router.post('/login', responseUnitCtrl.login);
router.get('/', auth, responseUnitCtrl.getAllResponseUnits);
router.get('/:id', auth, responseUnitCtrl.getResponseUnit);
router.post('/:id', auth, responseUnitCtrl.updateResponseUnit);

module.exports = router;
