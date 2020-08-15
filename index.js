const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();



app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res) {
    res.render('index');
});


app.get('/sw.js', function(req, res) {
    res.render('sw.js');
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res) {
    console.log(req.body);
    res.send('"recieved your request!"');
});
app.listen(3000);