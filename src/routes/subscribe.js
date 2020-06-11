const express = require('express');

const router = express.Router();

const subscriptionCtrl = require('../controllers/subscriptionController');

router.post('/', subscriptionCtrl.subscribe);
router.put('/:id', subscriptionCtrl.updateSubscription);
router.get('/:id', subscriptionCtrl.getSubscription);
router.get('/', (req, res) => {
  res.status(400).json({
    error: 'Invalid or bad request.'
  });
});

module.exports = router;
