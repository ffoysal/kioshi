const express = require('express');
const messageRouter = require('./messageRouter.js');

let manageResponse = (err, status, responseBody, res, next) => {
  if (err) {
    next(err);
  }
  else if (responseBody) {
    sendResponse(status, responseBody, res);
  }
  else {
    res.status(status).send();
  }
};

let sendResponse = (status, responseBody, res) => {
  return res.status(status).json(responseBody);
};

let sendError = (status, message, res) => {
  sendResponse(
    status,
    {
      ok: false,
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

  /*
  // Handle errors Development or test environment
  if (config.environment === "development" || config.environment === "test") {
    // Handle Errors in api rest
    apiRoutes.use((err, req, res, next) => {
      //TODO Just for development mode
      console.log(err);
      sendError(err.status || 500, err.message || "", err, res);
    });
  }
  */
  apiRoutes.use((err, req, res, next) => {
    //TODO Just for development mode
    console.log(err);
    sendError(err.status || 500, err.message || '', res);
  });
  // for all other routes
  app.use('*', (req, res) => {
    // console.log(req);
    sendError(404, req.originalUrl + 'Not Found', res);
  });

};