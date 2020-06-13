const Subscription = require('../models/subscriber');

exports.subscribe = (req, res) => {
  const subscriptionObj = new Subscription(req.body);

  subscriptionObj.save()
    .then((subscription) => {
      res.status(200).json({
        subscription,
        message: 'Subscription created successfully!'
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};

exports.getSubscription = (req, res) => {
  Subscription.find({ endpoint: req.params.id })
    .then((subscriptions) => {
      res.status(200).json({
        subscriptions
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
        message: 'Something went wrong while getting subscriptions!'
      });
    });
};

exports.getAllSubscriptions = (req, res) => {
  Subscription.find({ userId: req.params.id })
    .then((subscriptions) => {
      res.status(200).json({
        subscriptions
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
        message: 'Something went wrong while getting subscriptions!'
      });
    });
};

exports.updateSubscription = (req, res) => {
  Subscription.findOneAndUpdate(
    {
      endpoint: {
        $regex: `${req.params.id}`, $options: 'i'
      }
    },
    { userId: req.body.userId },
    { new: true }
  )
    .then((subscription) => {
      res.status(200).json({
        message: 'Subscription updated successfully!',
        subscription
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};
