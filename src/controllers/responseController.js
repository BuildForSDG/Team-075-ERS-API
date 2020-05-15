const geolib = require('geolib');
const Joi = require('@hapi/joi');

const schemaVictim = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

const schemaEmergency = Joi.array().min(1).items(Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
})).required();

const victimAndResponseUnit = (victimsCoordinate, emergencyResponseCoordinates) => {
  const victimResult = schemaVictim.validate(victimsCoordinate);
  const responseResult = schemaEmergency.validate(emergencyResponseCoordinates);
  const { value, error } = victimResult;

  if (typeof (error) === 'object') {
    return 'Invalid input to victimAndResponseUnit.';
  }
  if (typeof (responseResult.error) === 'object') {
    return 'Invalid input to victimAndResponseUnit.';
  }
  return `${geolib.getPreciseDistance(value, geolib.findNearest(value, responseResult.value)) / 1000}km`;
};

module.exports = victimAndResponseUnit;
