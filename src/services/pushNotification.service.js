const webPush = require('web-push');
const q = require('q');
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
 * @param {Object} notificationPayload
 */
const sendNotification = (notificationPayload) => new Promise((resolve, reject) => {
  const {
    title, message, url, data, tag, userId
  } = notificationPayload;

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

  Subscription.find({ userId })
    .then((subscriptions) => {
      if (!subscriptions || (Array.isArray(subscriptions) && subscriptions.length === 0)) {
        const error = {
          status: false,
          error: 'No subscription found for this device, application or user!'
        };
        reject(error);
      } else {
        const parallelNotificationCalls = subscriptions.map(
          (subscription) => new Promise((resolved, rejected) => {
            notifySubscribers(payload, subscription)
              .then((notificationResult) => {
                resolved({
                  status: true,
                  endpoint: subscription.endpoint,
                  message: 'Push Notification!',
                  data: notificationResult
                });
              })
              .catch((error) => {
                const err = {
                  status: false,
                  endpoint: subscription.endpoint,
                  message: 'Something went wrong with sending the notifications.',
                  error
                };
                rejected(err);
              });
          })
        );

        q.allSettled(parallelNotificationCalls).then((pushNotificationResults) => {
          resolve({
            pushNotificationResults
          });
        });
      }
    })
    .catch((error) => {
      const err = {
        message: 'Something went wrong while getting subscriptions',
        error
      };
      reject(err);
    });
});

module.exports = sendNotification;
