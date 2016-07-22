'use strict';

var bodyParser = require('body-parser');
var express    = require('express');
var morgan     = require('morgan');
var passport   = require('passport');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');

var routes     = require('./api/routes/index.js');

var app        = express();
var mongoUrl   = process.env.MONGODB_URI || "mongodb://localhost:27017/rvg-picterest";
var port       = process.env.PORT || 3000;

app.use(morgan('dev'));

mongoose.connect(mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Successfully connected to MongoDB on ' + mongoUrl);

   app.use(express.static(__dirname + '/app'));   
   app.use('/models', express.static(process.cwd() + '/api/models'));
   app.use('/controllers', express.static(process.cwd() + '/api/controllers'));
   app.use( bodyParser.json() );
   app.use(bodyParser.urlencoded({
      extended: true
   }));

   //require('./config/passport')(passport);
   //app.use(passport.initialize());

   routes(app);

   app.listen(port, function () {
      console.log('Node.js listening on port ' + port + '...');
   });
});
