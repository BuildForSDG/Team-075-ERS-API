const express = require('express');
const passport = require('passport');
const auth = require('../middleware/authMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const userCtrl = require('../controllers/userController');

router.post('/signup', userValidation, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.profile);
router.post('/profile/:id', auth, userCtrl.edit);
router.get('/facebook', userCtrl.facebookLogin);
router.get('/facebook/fail', userCtrl.facebookLoginFail);
router.get('/facebook/callback', passport.authenticate('facebook', { scope: ['email'], failureRedirect: '/facebook/fail' }), userCtrl.facebookLoginSuccess);

module.exports = router;
