const Report = require('../models/report');
const mapService = require('../services/map.service');

const responeUnitsLocationFile = process.env.ERS_GPS_COORDINATES_FILENAME;

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
  })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });

  // TODO tie in mapService
};

exports.getReport = (req, res) => {
  Report.findOne({
    _id: req.params.id
  })
    .then((report) => {
      res.status(200).json({
        report
      });
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
};

exports.modifyReport = (req, res) => {
  const {
    reporter: { userId, phoneNo },
    location: { latitude, longitude },
    response: {
      status, responderId, acceptedAt, etaToLocation, arrivedAt
    },
    imageUrl
  } = req.body;

  const report = new Report({
    _id: req.params.id,
    reporter: {
      userId,
      phoneNo
    },
    location: {
      latitude,
      longitude
    },
    imageUrl,
    response: {
      status,
      responder: responderId,
      acceptedAt,
      etaToLocation,
      arrivedAt
    }
  });

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

exports.getReports = (req, res) => {
  Report.find().then((reports) => {
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

exports.storeResponseUnitLocation = (req, res) => {
  mapService.writeCoordinates(responeUnitsLocationFile, req.body)
    .then(() => {
      res.status(200).json({
        message: 'Location stored successfully!'
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

exports.getResponseUnitsLocation = (req, res) => {
  mapService.readCoordinates(responeUnitsLocationFile)
    .then((locations) => {
      res.status(200).json({
        locations
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

exports.getClosestResponseUnit = (req, res) => {
  mapService.getDistanceToNearestResponseUnit(req.body)
    .then((responseTeam) => {
      res.status(200).json({
        message: 'Successful',
        responseTeam
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};
