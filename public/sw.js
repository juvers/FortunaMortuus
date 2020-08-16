var CACHE_NAME = 'offline-form';
var urlsToCache = [
    '/',
    '/styles.css',
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js",

];
self.addEventListener('install', function(event) {
    // install file needed offline
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener('fetch', function(event) {
    console.log('Testing fetch in service worker: ',
        event.request.clone().url)

});



self.addEventListener('push', event => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: 'Push notification works now!',
    });
});