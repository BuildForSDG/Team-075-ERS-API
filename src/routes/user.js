const express = require('express');
const auth = require('../middleware/authMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const userCtrl = require('../controllers/userController');

router.post('/signup', userValidation, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.profile);
router.post('/profile/:id', auth, userCtrl.edit);

module.exports = router;
