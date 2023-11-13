function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window));
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
            console.log('Service worker successfully registered.');
            return registration;
    }).catch(function(err) {
            console.error('Impossible d\'enregistrer un  service worker.', err);
    });
}