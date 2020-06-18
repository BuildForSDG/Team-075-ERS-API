const express = require('express');
const passport = require('passport');
const { auth } = require('../middleware/authMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

const userCtrl = require('../controllers/userController');

router.post('/signup', userValidation, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', auth('user'), userCtrl.logout);
router.put('/profile/:id', auth('user'), userCtrl.edit);
router.put('/profile/:id/password', auth('user'), userCtrl.changePassword);
router.get('/profile/:id', auth(['admin', 'user']), userCtrl.profile);
router.get('/facebook', userCtrl.facebookLogin);
router.get('/social-login/success', userCtrl.socialLoginSuccess);
router.get('/facebook/fail', userCtrl.facebookLoginFail);
router.get('/facebook/callback', passport.authenticate('facebook',
  {
    scope: ['email'],
    failureRedirect: '/api/auth/facebook/fail'
  }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
});
router.get('/google', userCtrl.googleLogin);
router.get('/google/fail', userCtrl.googleLoginFail);
router.get('/google/callback', passport.authenticate('google',
  {
    failureRedirect: '/api/auth/google/fail'
  }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
});

module.exports = router;
