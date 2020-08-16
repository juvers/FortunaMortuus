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
            console.log('Opened cache and install');
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
    console.log("Push notification works too")
});

self.addEventListener('message', function(event) {
    console.log('form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script.js upon submission
        form_data = event.data.form_data
    }
})




function openDatabase() {
    var indexedDBOpenRequest = indexedDB.open('offline-form',
        IDB_VERSION)
    indexedDBOpenRequest.onerror = function(error) {
        // error creating db
        console.error('IndexedDB error:', error)
    }
    indexedDBOpenRequest.onupgradeneeded = function() {
            // This should only executes if there's a need to 
            // create/update db.
            this.result.createObjectStore('post_requests', {
                autoIncrement: true,
                keyPath: 'id'
            })
        }
        // This will execute each time the database is opened.
    indexedDBOpenRequest.onsuccess = function() {
        our_db = this.result
    }
}
var our_db
openDatabase()