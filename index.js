const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const webPush = require('web-push');
const path = require('path');
require('dotenv').config({ path: 'variables.env' });



app.set('view engine', 'pug');
app.set('views', './views');


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static(__dirname + '/public'));


const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:judekuti@gmail.com', publicVapidKey, privateVapidKey);


app.get('/', function(req, res) {
    res.render('index');
});

app.post('/submit', function(req, res) {
    console.log(req.body);
    res.send('"recieved your request!"');
});


app.post('/subscribe', (req, res) => {
    const subscription = req.body

    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
});

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});