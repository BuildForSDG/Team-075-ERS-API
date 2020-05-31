const { Client, Status } = require('@googlemaps/google-maps-services-js');
const geolib = require('geolib');
const fs = require('fs');
const lodash = require('lodash');

// const destination = [
//   { latitude: 6.246073, longitude: 5.636672 },
//   { latitude: 6.214418, longitude: 5.648431 },
//   { latitude: 6.034224, longitude: 5.673400 },
//   { latitude: 6.190696, longitude: 5.656444 }
// ];

let destination = [];

const getDistanceToNearestResponseUnit = (origin, destinations) => {
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

const readCoordinates = (filename) => new Promise(((resolve, reject) => {
  fs.readFile(`./${filename}`, 'utf8', (err, data) => {
    if (err) { // File doesn't exist
      // const error = JSON.parse(JSON.stringify(err));
      // error.message = err.stack.substring(err.stack.lastIndexOf(': ') + 1,
      // err.stack.indexOf(','));

      // Create the file
      fs.writeFile(`./${filename}`, '[]', { flag: 'wx' }, (error) => {
        if (error) {
          reject(error);
        }

        resolve([]);
      });
    }

    if (data) { // File exists
      resolve(JSON.parse(data));
    }
  });
}));

const writeCoordinates = (filename, responseUnitObj) => new Promise((resolve, reject) => {
  const { location: { latitude, longitude }, name } = responseUnitObj;
  readCoordinates(filename)
    .then((responseUnitCoordinates) => {
      const locations = responseUnitCoordinates;

      if (locations.length !== 0) {
        destination = locations;
      }

      // Check if the responseUnit already logged a location
      const responseUnit = lodash.find(destination, (data) => data.name === name);

      if (!responseUnit) { // push new entry
        destination.push({
          name,
          location: {
            latitude,
            longitude
          }
        });
      } else { // update existing entry
        lodash.map(destination, (data) => {
          if (data.name === name) {
            data.location = {
              latitude,
              longitude
            };
          }
        });
      }

      // Convert to JSON and indent the array objects
      const destinationJSON = JSON.stringify(destination, null, 2);

      fs.writeFile(filename, destinationJSON, 'utf-8', (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
      });
    })
    .catch((error) => {
      reject(error);
    });
});

module.exports = {
  getDistanceToNearestResponseUnit,
  readCoordinates,
  writeCoordinates
};
