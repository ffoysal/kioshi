/**
 * Define routers to be used by expressjs
 */

const express = require('express');
const messageRouter = require('./messageRouter');

let manageResponse = (err, status, responseBody, res, next) => {
  if (err) {
    sendError(err.status, err.message, res);
  } else {
    sendResponse(status, responseBody, res);
  }
};

let sendResponse = (status, responseBody, res) => {
  return res.status(status).json(responseBody);
};

let sendError = (status, message, res) => {
  sendResponse(
    status,
    {
      message: message
    },
    res
  );
};


module.exports = (app) => {
  const apiRoutes = express.Router();

  // register the messager router
  messageRouter.init(apiRoutes, manageResponse);

  // message api route
  app.use('/messages', apiRoutes);

  // route for health check
  app.get('/health', function (req, res) {
    res.status(200).json({
      content: 'Server is up and running'
    });
  });

  // all error handle by express error middleware route through this
  apiRoutes.use((err, req, res, next) => {
    //For developement purpose
    console.log(err);
    sendError(err.status || 500, err.message || '', res);
  });


  // for all other routes
  app.use('*', (req, res) => {
    // console.log(req);
    sendError(404, req.originalUrl + 'Not Found', res);
  });

};