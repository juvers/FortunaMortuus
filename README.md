### Fortune PWA
--
#### A Progressive Web App concept displaying push notifications and offline capacity.

### Push Notification
##### Requirements:
- dotenv : to load environment variables from a .env file
- web-push : Push notification library for Node.js
- Others inlcude express, body-parser etc...

#### Steps
1. Generate vapid keys( a pair of public and private keys used to restrict the validity of a push subscription to a specific application server and also to identify the server sending the push notifications). Basically a web standard. Generate keys as follows:
`./node_modules/.bin/web-push generate-vapid-keys`
2. Set up server and client fo communication
3. On a trigger push button, register the service worker which prompts the user to allow notifications for the current page
4. Convert the URL safe base64 string to Uint8Array
5. Write a subscription request route triggered by the trigger push button in #3 and let the service worker listen for this 'push' event
6. When a push event is received create a notification

### Offline User-ability
1. Interrupt the post event to output data into a container
2. Use existing service worker created for push above(starting with install) and listen for the fetch event.
3. Register the service worker(that is the file) and establish its scope
4. At this point turn off device wifi or even shut down the server and the page still populates
5. Employ indexedb as a safe house between the client and the server
6. Create indexedb database and create object store for the db( as a db can contain several object stores).
7. Use `navigator.serviceworker.controller.postMessage(msg)` to transport our form data to the service worker
8. Listen for `message` event in the service worker
9. Save form data in indexedb and ensure post request is intercepted to prevent errors when offline. This is best achieved as we listen for the `fetch` event.
10. Get saved payload, request url and method type from the object store using `getObjectStore`.
11. Shut down server and go offline on client to simulate total network failure and attempt a post event on the client. 
12. Request a background sync by registering the request in the helper script and listen for the sync event in service worker script. 
13. The sync event in the service worker script is triggered when the browser comes back online.
14. Retrieve all saved requests from indexedb using cursors and save them into an array.
15. Iterate through the array of saved requests and retrieve that particular request's url, payload and method. 
16. Usign fetch API send the request to the server. Its good practice to delete the particular saved request sent from the indexedb if the response is a 200 so not to send the post multiple times. If the reponse is a 500 server error retain saved request in the indexedb to retry.
17. Good practice as well to ensure th update on reload in the service worker application is checked. 
