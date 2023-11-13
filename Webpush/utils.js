function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window));
}



function registerServiceWorker() {
    return navigator.serviceWorker.register('serviceworker.js')
    .then(function(registration) {
            console.log('Service worker successfully registered.');
            return registration;
    }).catch(function(err) {
            console.error('Impossible d\'enregistrer un  service worker.', err);
    });
}


function askPermission() {
    return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
        .then(function(permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('Granted permission.');
            }
        });
}

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/api/save-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }
            return response.json();
        })
        .then(function(responseData) {
            if (responseData.status !== 'success') {
                throw new Error('Bad response from server.');
            }
        })
        .catch(function(err) {
            console.error('Error during fetch:', err);
        });
}

/*
function subscribeUserToPush() {
    return navigator.serviceWorker.register('serviceworker.js')
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(__ApplicationServerKey)
            };
            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            //return pushSubscription;
            return sendSubscriptionToBackEnd(subscription);
        })
        .catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
}
*/

function subscribeUserToPush() {
    return navigator.serviceWorker.register('serviceworker.js')
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(__ApplicationServerKey)
            };
            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return sendSubscriptionToBackEnd(pushSubscription);
        })
        .catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
}


function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
