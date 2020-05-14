/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/user');

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

    user.save().then(() => {
      res.status(201).json({
        message: 'Registration successful!'
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

        const token = jwt.sign({ userId: user._id },
          'RANDOM_TOKEN_SECRET_STRING',
          { expiresIn: '1h' });

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

// TODO: User - UPDATE PASSWORD
