/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passport = require('../middleware/passportMiddleware');
const User = require('../models/user');

const signToken = (user) => jwt.sign({ user },
  process.env.JWT_SECRET,
  { expiresIn: '1.5 hrs' });

const generateAccessToken = (userId) => jwt.sign({ userId },
  process.env.JWT_SECRET,
  { expiresIn: '1.5 hrs' });

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      emergencyContact: {
        name: req.body.emergencyContact.name,
        phoneNo: req.body.emergencyContact.phoneNo
      },
      password: hash
    });

    user.save().then((createdUser) => {
      const token = generateAccessToken(createdUser._id);
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
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(401).json({
        error: new Error('Username/Email not found!')
      });
    } else {
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            error: new Error('Incorrect password!')
          });
        }

        const token = generateAccessToken(user._id);

        return res.status(200).json({
          userId: _.omit(user.toObject(), ['password', '__v', 'createdAt', 'modifiedAt']),
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
