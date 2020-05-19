/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
require('dotenv').config();

// Configure Passport authenticated session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Configure Passport to use Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'name', 'emails', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  const {
    id, email, first_name: firstName, last_name: lastName
  } = profile._json;

  // Check Db to find a user with the id
  User.findOne({ providerId: id }).then((user) => {
    if (!user) { // if no user create new user
      const newUser = new User({
        name: `${firstName} ${lastName}`,
        email,
        provider: 'facebook',
        providerId: id,
        providerData: {
          accessToken,
          refreshToken
        }
      });

      return newUser.save()
        .then(() => done(null, newUser))
        .catch((error) => done(error, null, error.message));
    }

    return done(null, user);
  }).catch((error) => error);
}));

module.exports = passport;
