const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const requestFromQueryMiddleware = require('../middleware/queryMiddleware');
const {
  responseUnitValidation,
  responseUnitLocationValidation,
  locationValidation
} = require('../middleware/validationMiddleware');

const router = express.Router();

const responseUnitCtrl = require('../controllers/responseUnitController');

router.post('/signup', responseUnitValidation, responseUnitCtrl.signup);
router.post('/login', responseUnitCtrl.login);
router.post('/id/:id', auth('admin'), responseUnitCtrl.updateResponseUnit);
router.post('/location', responseUnitLocationValidation, responseUnitCtrl.storeResponseUnitLocation);
router.post('/nearest-eru', locationValidation, responseUnitCtrl.getClosestResponseUnit);
router.get('/location', responseUnitCtrl.getResponseUnitsLocation);
router.get('/nearest-eru',
  requestFromQueryMiddleware, locationValidation, responseUnitCtrl.getClosestResponseUnit);
router.get('/id/:id', requestFromQueryMiddleware, auth('admin'), responseUnitCtrl.getResponseUnit);
router.get('/', auth('admin'), responseUnitCtrl.getAllResponseUnits);

module.exports = router;
