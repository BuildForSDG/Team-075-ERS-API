/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const Report = require('../models/report');
const sendPushNotification = require('../services/pushNotification.service');
const mapService = require('../services/map.service');

/**
 * Create a report
 */
exports.createReport = (req, res) => {
  const { reporter, location, imageUrl } = req.body;

  const report = new Report({
    reporter: {
      userId: reporter.userId,
      phoneNo: reporter.phoneNo
    },
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    imageUrl
  });

  report.save().then((createdReport) => {
    res.status(200).json({
      message: 'Report logged successfully!',
      report: createdReport
    });

    console.log('About to contact response team');
    // Get closest response unit and notify via pushNotification
    mapService.getDistanceToNearestResponseUnit(location)
      .then((result) => {
        console.log('Response Team identified');
        // Notification Payload for Response Unit
        const notificationPayload = {
          title: 'New Accident',
          message: 'Accident close by, Help needed immediately.',
          url: process.env.FRONTEND_URL,
          data: location,
          tag: ['Emergency Response System', 'Accident'],
          userId: result.responseUnit._id
        };

        // Notification Payload for Reporter
        const reporterNotificationPayload = {
          title: 'Response Team Notified',
          message: 'The nearest response unit available has been notified.',
          url: process.env.FRONTEND_URL,
          data: result.responseUnit.name,
          tag: ['Emergency Response System', 'Accident'],
          userId: reporter.userId
        };

        // Send notification to response unit
        sendPushNotification(notificationPayload)
          .then((notificationResult) => {
            console.info(notificationResult);
          })
          .catch((error) => {
            console.error(error);
          });

        // Send notification to reporter
        sendPushNotification(reporterNotificationPayload)
          .then((notificationResult) => {
            console.info(notificationResult);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

/**
 * Create a report as an Eye witness
 */
exports.createReportAsWitness = (req, res) => {
  const report = JSON.parse(req.body.report);

  const url = `${req.protocol}://${req.get('host')}`;

  const {
    reporter: {
      userId,
      phoneNo
    },
    location: { lat, lng },
    typeOfAccident,
    noOfPersons,
    description
  } = report;


  const eyeWitnessReport = new Report({
    reporter: {
      userId,
      phoneNo
    },
    location: {
      latitude: lat,
      longitude: lng
    },
    type: typeOfAccident,
    personsInvolved: noOfPersons,
    description,
    imageUrl: `${url}/images/${req.file.filename}`
  });

  eyeWitnessReport.save().then((createdReport) => {
    res.status(200).json({
      message: 'Report logged successfully!',
      report: createdReport
    });
  })
    .catch((error) => {
      res.status(500).json({
        message: 'Error saving report',
        error
      });
    });
};

/**
 * Get a report
 */
exports.getReport = (req, res) => {
  Report.findOne({
    _id: req.params.id
  }).populate({
    path: 'reporter.userId',
    model: 'User'
  })
    .then((report) => {
      if (report) {
        res.status(200).json({
          report
        });
      } else {
        res.status(404).json({
          error: 'No report with that Id was found!'
        });
      }
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
};

/**
 * Modify a report
 */
exports.modifyReport = (req, res) => {
  let report = new Report({ _id: req.params.id });

  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    req.body = JSON.parse(req.body);
    const {
      reporter: { userId, phoneNo },
      location: { latitude, longitude },
      response: {
        status, responderId, acceptedAt, etaToLocation, arrivedAt
      },
      type,
      personsInvolved,
      description
    } = req.body;

    report = {
      _id: req.params.id,
      reporter: {
        userId,
        phoneNo
      },
      location: {
        latitude,
        longitude
      },
      type,
      personsInvolved,
      description,
      imageUrl: `${url}/images/${req.file.filename}`,
      response: {
        status,
        responder: responderId,
        acceptedAt,
        etaToLocation,
        arrivedAt
      }
    };
  } else {
    const {
      reporter: { userId, phoneNo },
      location: { latitude, longitude },
      response: {
        status, responderId, acceptedAt, etaToLocation, arrivedAt
      },
      type,
      personsInvolved,
      description,
      imageUrl
    } = req.body;

    report = {
      _id: req.params.id,
      reporter: {
        userId,
        phoneNo
      },
      location: {
        latitude,
        longitude
      },
      type,
      personsInvolved,
      description,
      imageUrl,
      response: {
        status,
        responder: responderId,
        acceptedAt,
        etaToLocation,
        arrivedAt
      }
    };
  }

  try {
    Report.updateOne({ _id: req.params.id }, report)
      .then(() => {
        res.status(201).json({
          message: 'Report updated successfully'
        });
      }).catch((error) => {
        res.status(400).json({
          error
        });
      });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
};

/**
 * Delete a report
 */
exports.deleteReport = (req, res) => {
  Report.findOne({ _id: req.params.id })
    .then(() => {
      // TODO: delete report image and delete report

      Report.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: 'Report deleted successfully!'
          });
        }).catch((error) => {
          res.status(400).json({
            error
          });
        });
    }).catch((error) => {
      res.status(404).json({
        error
      });
    });
};

/**
 * Get all reports
 */
exports.getReports = (req, res) => {
  Report.find().populate({
    path: 'reporter.userId',
    model: 'User'
  }).then((reports) => {
    res.status(200).json({
      reports
    });
  })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
};
