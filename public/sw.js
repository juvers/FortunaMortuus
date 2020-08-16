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
    console.log('I am a request with url: ',
        event.request.clone().url)
    if (event.request.clone().method === 'GET') {
        event.respondWith(
            // inspect caches in the browser to check if request exists
            caches.match(event.request.clone())
            .then(function(response) {
                if (response) {
                    //return the response stored in browser
                    return response;
                }
                // no match in cache, use the network instead
                return fetch(event.request.clone());
            })
        );
    } else if (event.request.clone().method === 'POST') {
        // attempt to send request normally
        event.respondWith(fetch(event.request.clone()).catch(function(error) {
            // only save post requests in browser, if an error occurs
            savePostRequests(event.request.clone().url, form_data)
        }))
    }
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
});

self.addEventListener('sync', function(event) {
    console.log('now online')
    if (event.tag === 'sendFormData') { // event.tag name checked
        // here must be the same as the one used while registering
        // sync
        event.waitUntil(
            // Send our POST request to the server, now that the user is
            // online
            sendPostToServer()
        )
    }
});


function getObjectStore(storeName, mode) {
    // retrieve our object store
    return our_db.transaction(storeName, mode).objectStore(storeName)
}

function savePostRequests(url, payload) {
    // get object_store and save our payload inside it
    var request = getObjectStore(FOLDER_NAME, 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST'
    })
    request.onsuccess = function(event) {
        console.log('a new post request has been added to indexedb')
    }
    request.onerror = function(error) {
        console.error(error)
    }
}

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