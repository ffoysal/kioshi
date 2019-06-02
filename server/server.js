const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const router = require('./router/router.js');

global.__basedir = __dirname + "/";

const app = express();

// swagger initialization
require('./swagger/swagger').init(app, express);
console.log('Initialize Swagger');


// connect to database, if fail exit from app
mongoose.connect(config.mongoDBURI, { useNewUrlParser: true }, function (err, database) {
  if (err) {
    console.log('Cannot connect to database');
    process.exit(1);
  }
});

// Log all API request
//app.use(logger('dev'));

// Parse urlencoded bodies to JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Redirect to swagger docs
app.get('/', function (req, res) {
  res.redirect('/docs');
});

// start the app
app.listen(config.serverPort);

router(app);

module.exports = app;


