/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { signToken } = require('../middleware/authMiddleware');
const passport = require('../middleware/passportMiddleware');
const User = require('../models/user');

exports.signup = (req, res) => {
  const {
    password, name, email, phoneNo
  } = req.body;

  User.findOne({ $or: [{ phoneNo }, { email }] })
    .then((userFound) => {
      if (userFound) {
        res.status(409).json({
          error: 'Email or Phone No. already exists.'
        });
      } else {
        bcrypt.hash(password, 10).then((hash) => {
          const user = new User({
            name,
            email,
            phoneNo,
            password: hash
          });

          user.save().then((createdUser) => {
            // Generate a token for the user
            const token = signToken(createdUser);

            res.status(201).json({
              message: 'Registration successful!',
              token
            });
          }).catch((error) => {
            res.status(500).json({
              error
            });
          });
        });
      }
    })
    .catch((error) => res.status(500).json({
      error
    }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(404).json({
        error: 'No account with that email was found!'
      });
    } else {
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            error: new Error('Incorrect password!')
          });
        }

        const token = signToken(user);

        return res.status(200).json({
          user: _.omit(user.toObject(), ['password', '__v', 'createdAt', 'modifiedAt']),
          token
        });
      }).catch((error) => {
        res.status(500).json({
          error
        });
      });
    }
  }).catch((error) => {
    res.status(500).json({
      error
    });
  });
};

exports.profile = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          user
        });
      }

      return res.status(404).json({
        error: 'User not found.'
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

exports.edit = (req, res) => {
  const user = new User({
    _id: req.params.id,
    name: req.body.name,
    phoneNo: req.body.phoneNo,
    emergencyContact: {
      name: req.body.emergencyContact.name,
      phoneNo: req.body.emergencyContact.phoneNo
    }
  });

  User.updateOne({ _id: req.params.id }, user)
    .then(() => {
      res.status(201).json({
        message: 'Profile updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};

// TODO: User - DELETE PROFILE

exports.changePassword = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      _id: req.params.id,
      password: hash
    });

    User.updateOne({ _id: req.params.id }, user)
      .then(() => {
        res.status(201).json({
          message: 'Password updated successfully!'
        });
      })
      .catch((error) => {
        res.status(400).json({
          error
        });
      });
  });
};

exports.facebookLogin = (req, res, next) => {
  passport.authenticate('facebook', { scope: ['email'] })(req, res);

  return next();
};

exports.facebookLoginSuccess = (req, res) => {
  res.status(200)
    .cookie('jwt', signToken(req.user), {
      maxAge: 5400000,
      httpOnly: true
    })
    .json({
      message: 'Facebook authentication successful!'
    });
};

exports.facebookLoginFail = (req, res) => {
  res.status(401).json({
    error: 'Facebook authentication failed!'
  });
};

exports.googleLogin = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  })(req, res);

  next();
};

exports.googleLoginSuccess = (req, res) => {
  res.status(200)
    .cookie('jwt', signToken(req.user), {
      maxAge: 5400000,
      httpOnly: true
    })
    .json({
      message: 'Google authentication successful!'
    });
};

exports.googleLoginFail = (req, res) => {
  res.status(401).json({
    error: 'Google authentication failed!'
  });
};

exports.logout = (req, res) => {
  res.status(200).clearCookie('jwt').json({
    message: 'Cookie cleared successfully!'
  });
};
