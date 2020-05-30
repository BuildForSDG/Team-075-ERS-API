const express = require('express');
const auth = require('../middleware/authMiddleware');
const { responseUnitValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const responseUnitCtrl = require('../controllers/responseUnitController');

router.post('/signup', responseUnitValidation, responseUnitCtrl.signup);
router.post('/login', responseUnitCtrl.login);
router.post('/:id', auth, responseUnitCtrl.updateResponseUnit);
router.get('/:id', auth, responseUnitCtrl.getResponseUnit);
router.get('/', auth, responseUnitCtrl.getAllResponseUnits);

module.exports = router;
