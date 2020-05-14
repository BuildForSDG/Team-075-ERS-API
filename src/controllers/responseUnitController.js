/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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

    responseUnit.save().then(() => {
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
  ResponseUnit.findOne({ email: req.body.email }).then((responseUnit) => {
    if (!responseUnit) {
      res.status(401).json({
        error: new Error('Username/Email not found!')
      });
    } else {
      bcrypt.compare(req.body.password, responseUnit.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            error: new Error('Incorrect password!')
          });
        }

        const token = jwt.sign({ responseUnitId: responseUnit._id },
          'RANDOM_TOKEN_SECRET_STRING',
          { expiresIn: '1h' });

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

// TODO: Reponse Unit - UPDATE PASSWORD
