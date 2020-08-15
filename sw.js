var CACHE_NAME = 'offline-form';
var urlsToCache = [
    '/',
    '/styles.css',
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
    console.log('I am a request with url: ',
        event.request.clone().url)

});