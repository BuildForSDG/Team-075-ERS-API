const joi = require('@hapi/joi');

const userSchema = joi.object({
  name: joi.string().pattern(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
  phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).required(),
  emergencyContact: joi.object({
    name: joi.string().pattern(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/).required(),
    phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).disallow(joi.ref('/phoneNo')).required()
  })
}).options({ stripUnknown: true });

const reportSchema = joi.object({
  reporter: joi.object().keys({
    phoneNo: joi.string().pattern(/^([0-9])\d{10}$/).required(),
    userId: joi.string()
  }),
  location: joi.object({
    latitude: joi.string().required(),
    longitude: joi.string().required()
  })
}).options({ stripUnknown: true });

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

const victimLocationSchema = joi.object().keys({
  latitude: joi.number().required(),
  longitude: joi.number().required()
});

const responseUnitsSchema = joi.array().min(1).items(joi.object().keys({
  latitude: joi.number().required(),
  longitude: joi.number().required()
})).required();

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

module.exports = {
  userValidation,
  reportValidation,
  responseUnitValidation,
  coordinatesValidation
};
