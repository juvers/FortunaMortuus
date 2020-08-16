// Offline Userabilty

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log(registration.scope);
            // if (registration.installing) {
            //     registration.installing.postMessage("Howdy from your installing page.");
            // }
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ',
                err);
        });
        // navigator.serviceWorker.onmessage = function(e) {
        //     // messages from service worker.
        //     console.log('e.data', e.data);
        // };
        navigator.serviceWorker.ready.then(function(registration) {
            console.log('Service Worker Ready')
            return registration.sync.register('sendFormData')
        }).then(function() {
            console.log('sync event registered')
        }).catch(function() {
            // system was unable to register for a sync,
            // this could be an OS-level restriction
            console.log('sync registration failed')
        });
    });
}

$("#contact").submit(function(event) {

    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $(this),
        full_name = $form.find("input[name='name']").val(),
        email = $form.find("input[name='email']").val(),
        phone = $form.find("input[name='phone']").val(),
        title = $form.find("input[name='title']").val(),
        message = $form.find("textarea[name='message']").val(),

        data = {
            full_name: full_name,
            email: email,
            phone: phone,
            title: title,
            message: message,
        }
    console.log("Is data posting: ", data);
    var msg = {
        'form_data': data
    }

    console.log("Is msg right: ", msg);

    navigator.serviceWorker.controller.postMessage(msg)

    console.log(data);
    $.ajax({
        type: "POST",
        url: '/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function() {
            console.log('data sent to server successfully');
        }
    });
    // message = 'Your data has been sent to the server'
    // $('#message').append(message)
    return false
});



// Push Notifications

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const publicVapidKey = 'BLrrGe1Y15dRQ7t0Zm_ztXXCU569AgOR8GBgXF7lXywMV8AW-JZf_AKMYan9PVBwmwinL9KNE-KWe1pPJkkqhE4';

const triggerPush = document.querySelector('.trigger-push');

async function triggerPushNotification() {
    if ('serviceWorker' in navigator) {
        const register = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        console.error('Service workers are not supported in this browser');
    }
}

triggerPush.addEventListener('click', () => {
    triggerPushNotification().catch(error => console.error(error));
});