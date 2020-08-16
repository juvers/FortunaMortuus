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

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', function(req, res) {
    console.log(req.body);
    res.send('"recieved your request!"');
});
app.listen(3000);