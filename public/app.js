/* eslint-disable no-console */
let isSubscribed = false;
let swRegistration = null;
const applicationKey = 'BKtwXxQ0GEsZ0TX-POa8i48XyXh6tQbFEoYLebu6c3LTIC-WeVti0__GjmI560-yMBzqNk69jxoL6CizxH3D1X8';


// Url Encryption
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Send a request to the database to add a new subscriber
function saveSubscription(subscription) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open('POST', '/api/subscribe');
  xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState !== 4) return;
    if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
      console.log(`HTTP error ${xmlHttp.status}`, null);
    } else {
      console.log('User subscribed to server');
    }
  };

  // Add userId to subscription object before saving

  xmlHttp.send(JSON.stringify(subscription));
}

// Installing service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then((swReg) => {
      console.log('service worker registered');

      swRegistration = swReg;

      swRegistration.pushManager.getSubscription()
        .then((subscription) => {
          isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log(subscription);
            console.log('User is already subscribed');
          } else {
            swRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlB64ToUint8Array(applicationKey)
            })
              .then((resSubscription) => {
                console.log(resSubscription);
                console.log('User is subscribed');

                saveSubscription(resSubscription);

                isSubscribed = true;
              })
              .catch((err) => {
                console.log('Failed to subscribe user: ', err);
              });
          }
        });
    })
    .catch((error) => {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
}
