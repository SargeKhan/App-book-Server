var express = require('express')
var app = express();


// Retrieve
var MongoClient = require('mongodb').MongoClient;
var people= require('./routes/people.js');
var apps= require('./routes/apps.js');
var monk = require('monk');
var db = monk('localhost:27017/appbook');
// Connect to the db
app.use(function(req,res,next){
    req.db = db;
    next();
});
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));


app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
app.get('/people/:email_id', people.getPerson);
app.get('/peoplefriends/:ids',people.getFriends);
app.get('/people/:starting_no', people.getPeople);
app.get('/peopleArray/:keyWord',people.findPersonList);
app.get('/people', people.getAll);
app.get('/app/:packageName',apps.getApp);
app.post('/people', people.addPerson);
app.post('/app', apps.addApp);
app.get('', apps.test);
app.post('/userApps',apps.setUserApps);