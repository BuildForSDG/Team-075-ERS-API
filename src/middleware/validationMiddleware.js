const joi = require('@hapi/joi');

/**
 * Schema for Users
 */
const userSchema = joi.object({
  name: joi.string().pattern(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
  phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).required(),
  emergencyContact: joi.object({
    name: joi.string().pattern(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/).allow(''),
    phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).disallow(joi.ref('/phoneNo')).allow('')
  })
}).options({ stripUnknown: true });

/**
 * Schema for Reports
 */
const reportSchema = joi.object({
  reporter: joi.object({
    phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).required(),
    userId: joi.string().required()
  }),
  location: joi.object({
    latitude: joi.string().required(),
    longitude: joi.string().required()
  }),
  type: joi.string(),
  personsInvolved: joi.number(),
  description: joi.string(),
  imageUrl: joi.string(),
  response: joi.object({
    status: joi.string(),
    responder: joi.string(),
    acceptedAt: joi.date().timestamp(),
    etaToLocation: joi.string(),
    arrivedAt: joi.date().timestamp()
  })
}).options({ stripUnknown: true });

/**
 * Schema for Response Units
 */
const responseUnitSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
  contact: joi.object({
    primaryPhoneNo: joi.string().pattern(/^([0-9])\d{10}$/).required(),
    secondaryPhoneNo: joi.string().pattern(/^([0-9])\d{10}$/).disallow(joi.ref('primaryPhoneNo')).required(),
    primaryAddress: joi.string().max(255),
    secondaryAddress: joi.string().disallow(joi.ref('primaryAddress')).max(255).allow(''),
    website: joi.string().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).max(255).allow('')
  })
}).options({ stripUnknown: true });

/**
 * Schema for Victim's Location
 */
const victimLocationSchema = joi.object({
  latitude: joi.number().required(),
  longitude: joi.number().required()
});

const responseUnitsSchema = joi.array().min(1).items(joi.object({
  latitude: joi.number().required(),
  longitude: joi.number().required()
})).required();

/**
 * Schema for storing locations of response units
 */
const responseUnitLocationSchema = joi.object({
  name: joi.string().required(),
  location: {
    latitude: joi.number().required(),
    longitude: joi.number().required()
  }
}).options({ stripUnknown: true });

/**
 * Validate the User object
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const userValidation = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      message: 'Please review the required fields!',
      error
    });
  }

  return next();
};

/**
 * Validate the Report object
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const reportValidation = (req, res, next) => {
  const { error } = reportSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      message: 'Invalid data schema.',
      error
    });
  }

  return next();
};

/**
 * Validate the Response Unit Object
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseUnitValidation = (req, res, next) => {
  const { error } = responseUnitSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      message: 'Invalid data schema.',
      error
    });
  }

  return next();
};

/**
 * Validate Victim and Response Unit Coordinates
 *
 * @param {Object} victimCoord
 * @param {Object} responseUnitCoord
 * @param {*} next
 */
const coordinatesValidation = (victimCoord, responseUnitCoord, next) => {
  const { error: victimCoordinatesError } = victimLocationSchema.validate(victimCoord);
  const { error: responseUnitCoordinatesError } = responseUnitsSchema.validate(responseUnitCoord);

  if (victimCoordinatesError) {
    return {
      message: 'Invalid user coordinates schema',
      error: victimCoordinatesError
    };
  }

  if (responseUnitCoordinatesError) {
    return {
      message: 'Invalid responseUnit coordinates schema',
      error: responseUnitCoordinatesError
    };
  }

  return next();
};

/**
 * Validate coordinates object
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const locationValidation = (req, res, next) => {
  const { error } = victimLocationSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      message: 'Invalid data schema'
    });
  }

  return next();
};

/**
 * Validate Reponse Unit Location Object
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseUnitLocationValidation = (req, res, next) => {
  const { error } = responseUnitLocationSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      message: 'Invalid data schema',
      error
    });
  }

  return next();
};

module.exports = {
  userValidation,
  reportValidation,
  responseUnitValidation,
  coordinatesValidation,
  locationValidation,
  responseUnitLocationValidation
};
