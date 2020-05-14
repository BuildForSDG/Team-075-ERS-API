const { Client, Status } = require('@googlemaps/google-maps-services-js');
const geolib = require('geolib');

const destination = [
  { latitude: 6.246073, longitude: 5.636672 },
  { latitude: 6.214418, longitude: 5.648431 },
  { latitude: 6.034224, longitude: 5.673400 },
  { latitude: 6.190696, longitude: 5.656444 }
];

const getDistanceToNearestResponseUnit = (origin, destinations = destination) => {
  const nearestResponseUnit = geolib.findNearest(origin, destinations);
  const client = new Client({});

  return new Promise((resolve, reject) => {
    client.directions({
      params: {
        origin,
        destination: nearestResponseUnit,
        mode: 'driving',
        key: process.env.API_KEY
      }
    }).then((result) => {
      if (result.data.status === Status.OK) {
        resolve(result.data.routes);
      }

      resolve(result.data);
    })
      .catch((error) => reject(error));
  });
};

module.exports = {
  getDistanceToNearestResponseUnit
};
