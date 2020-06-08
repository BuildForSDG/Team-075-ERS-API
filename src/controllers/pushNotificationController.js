const webPush = require('web-push');
const Subscription = require('../models/subscriber');

/**
 * Notify Subscriber
 *
 * @param {Object} payload
 * @param {Object} subscription
 */
const notifySubscribers = (payload, subscription) => new Promise((resolve, reject) => {
  // Create the push scubscription object
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }
  };

  // Push notification payload
  const pushPayload = JSON.stringify(payload);
  const pushOptions = { // Push notification options
    vapidDetails: {
      subject: 'http://emresys.herokuapp.com/api',
      privateKey: process.env.VAPID_PRIVATE_KEY,
      publicKey: process.env.VAPID_PUBLIC_KEY
    },
    TTL: payload.ttl,
    headers: {}
  };

  // Send the push notification
  webPush.sendNotification(
    pushSubscription,
    pushPayload,
    pushOptions
  ).then((value) => {
    resolve({
      status: true,
      endpoint: subscription.endpoint,
      data: value
    });
  })
    .catch((error) => {
      reject(error);
    });
});

/**
 *
 * Send Push Notification to a Subscriber
 *
 */
exports.sendNotification = (req, res) => {
  const {
    title, message, url, data, tag, userId, subscriberEndpoint
  } = req.body;

  const payload = {
    title,
    message,
    url,
    ttl: process.env.PUSH_NOTIFICATION_TTL,
    icon: process.env.PUSH_NOTIFICATION_ICON,
    badge: process.env.PUSH_NOTIFICATION_BADGE,
    data,
    vibrate: [100, 50, 100],
    tag
  };

  Subscription.findOne({ $or: [{ userId }, { endpoint: subscriberEndpoint }] })
    .then((subscriptions) => {
      if (!subscriptions) {
        res.status(404).json({
          error: 'No subscription found for this device, application or user!'
        });
      } else {
        notifySubscribers(payload, subscriptions)
          .then((notificationResult) => {
            res.status(200).json({
              message: 'Push Notification Triggered',
              data: notificationResult
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: 'Something went wrong with the notifications.',
              error
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong while getting subscriptions',
        error
      });
    });
};
