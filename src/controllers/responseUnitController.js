/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { signToken } = require('../middleware/authMiddleware');
const ResponseUnit = require('../models/responseUnit');

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const responseUnit = new ResponseUnit({
      name: req.body.name,
      email: req.body.email,
      contact: {
        primaryPhoneNo: req.body.contact.primaryPhoneNo,
        secondaryPhoneNo: req.body.contact.secondaryPhoneNo,
        primaryAddress: req.body.contact.primaryAddress,
        secondaryAddress: req.body.contact.secondaryAddress,
        website: req.body.contact.website
      },
      password: hash
    });

    responseUnit.save().then((createdUser) => {
      // Generate a token for the user
      const token = signToken(createdUser, 'admin');

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
  ResponseUnit.findOne({ email: req.body.email }).then((responseUnit) => {
    if (!responseUnit) {
      res.status(401).json({
        error: 'Username/Email not found!'
      });
    } else {
      bcrypt.compare(req.body.password, responseUnit.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            error: 'Incorrect password!'
          });
        }

        const token = signToken(responseUnit, 'admin');

        return res.status(200).json({
          responseUnit: _.omit(responseUnit.toObject(), ['password', '__v', 'createdAt', 'updatedAt']),
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

exports.getResponseUnit = (req, res) => {
  ResponseUnit.findOne({ _id: req.params.id }, { password: 0 }).then((responseUnit) => {
    res.status(200).json({
      responseUnit
    });
  }).catch((error) => {
    res.status(404).json({
      error
    });
  });
};

exports.getAllResponseUnits = (req, res) => {
  ResponseUnit.find().select('-password').then((responseUnits) => {
    res.status(200).json({
      responseUnits
    });
  }).catch((error) => {
    res.status(500).json({
      error
    });
  });
};

exports.updateResponseUnit = (req, res) => {
  const responseUnit = new ResponseUnit({
    _id: req.params.id,
    name: req.body.name,
    contact: {
      primaryPhoneNo: req.body.contact.primaryPhoneNo,
      secondaryPhoneNo: req.body.contact.secondaryPhoneNo,
      primaryAddress: req.body.contact.primaryAddress,
      secondaryAddress: req.body.contact.secondaryAddress,
      website: req.body.contact.website
    }
  });

  ResponseUnit.updateOne({ _id: req.params.id }, responseUnit)
    .then(() => {
      res.status(201).json({
        message: 'Response Unit details updated successfully!'
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

// TODO: Reponse Unit - DELETE

exports.changePassword = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const responseUnit = new ResponseUnit({
      _id: req.params.id,
      password: hash
    });

    ResponseUnit.updateOne({ _id: req.params.id }, responseUnit)
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

exports.logout = (req, res) => {
  res.status(200).clearCookie('jwt').json({
    message: 'Cookie cleared successfully!'
  });
};
