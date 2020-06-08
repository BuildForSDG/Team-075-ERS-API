const express = require('express');

const router = express.Router();

const pushNotificationCtrl = require('../controllers/pushNotificationController');

router.post('/', pushNotificationCtrl.sendNotification);
router.get('/', (req, res) => {
  res.status(404).json({
    error: 'Invalid or bad request.'
  });
});

module.exports = router;
