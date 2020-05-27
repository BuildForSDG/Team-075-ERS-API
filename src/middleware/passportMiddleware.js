/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
  }).catch((error) => done(error));
}));

// Configure Passport to use Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const {
    id, displayName, emails, provider
  } = profile;

  const verifiedEmail = emails.find((email) => email.verified).value || emails[0].value;

  // Check the database if the providerId or email exists
  User.findOne().or([{ providerId: id }, { email: verifiedEmail }])
    .then((user) => {
      if (!user) {
        const newUser = new User({
          name: displayName,
          email: verifiedEmail,
          provider,
          providerId: id,
          providerData: {
            accessToken,
            refreshToken
          }
        });

        newUser.save()
          .then(() => done(null, newUser))
          .catch((error) => {
            done(error, null);
          });
      }
      done(null, user);
    })
    .catch((error) => done(error, null));
}));

module.exports = passport;
