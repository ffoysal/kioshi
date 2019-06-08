const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const router = require('./router/router.js');

//for mock
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoServer = new MongoMemoryServer();



const app = express();

// swagger initialization
require('./swagger/swagger').init(app, express);
console.log('Initialize Swagger');

if (process.env.ENVIRONMENT == 'test') {
  mongoServer.getConnectionString().then((mongoUri) => {
    mongoose.connect(mongoUri, { useNewUrlParser: true });
  });
} else {
  // Log all API request
  app.use(logger('combined'));
  // connect to database, if fail exit from app
  mongoose.connect(config.mongoDBURI, { useNewUrlParser: true }, function (err) {
    if (err) {
      console.log('Cannot connect to database');
      process.exit(1);
    }
  });
}


// Parse urlencoded bodies to JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Redirect to swagger docs
app.get('/', function (req, res) {
  res.redirect('/docs');
});

// start the app
app.listen(config.serverPort);

// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

console.log('Server started at the port: ' + config.serverPort);
router(app);

module.exports = app;


