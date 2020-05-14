const Report = require('../models/report');
const mapService = require('../services/map.service');

exports.createReport = (req, res) => {
  const report = new Report({
    reporter: {
      userId: req.user ? req.user.id : null,
      phoneNo: req.user ? req.user.reporter.phoneNo : req.body.reporter.phoneNo
    },
    location: {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude
    },
    imageUrl: req.body.imageUrl
  });

  res.set('Content-Type', 'application/json');

  report.save().then(() => {
    res.write(JSON.stringify({
      message: 'Report logged successfully!'
    }));
  })
    .then(
      mapService.getDistanceToNearestResponseUnit(req.body.location)
        .then((response) => {
          res.write(JSON.stringify(response));
          res.end();
        })
        .catch((error) => {
          res.status(500).json({
            error: `Something went wrong with fetching distance details - ${error}`
          });
        })
    )
    .catch((error) => {
      res.status(500).json({
        error
      });
      console.error(error);
    });
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
  const report = new Report({
    _id: req.params.id
  });

  // TODO: Update Report Properties

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
