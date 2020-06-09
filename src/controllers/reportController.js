const Report = require('../models/report');

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
};

exports.createReportAsWitness = (req, res) => {
  req.body = JSON.parse(req.body);
  const url = `${req.protocol}://${req.get('host')}`;

  const {
    reporter,
    location,
    type,
    personsInvolved,
    description
  } = req.body;


  const report = new Report({
    reporter: {
      userId: reporter.userId,
      phoneNo: reporter.phoneNo
    },
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    type,
    personsInvolved,
    description,
    imageUrl: `${url}/images/${req.file.filename}`
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
};

exports.getReport = (req, res) => {
  Report.findOne({
    _id: req.params.id
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
