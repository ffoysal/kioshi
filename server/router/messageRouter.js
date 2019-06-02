const express = require('express');
const messageController = require('../controllers/messageController.js');

module.exports.init = (apiRoutes, manageResponse) => {

  apiRoutes.post('/', (req, res, next) => {
    messageController.createMessage(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  apiRoutes.get('/:id', (req, res, next) => {
    messageController.getMessage(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  apiRoutes.delete('/:id', (req, res, next) => {
    messageController.deleteMessage(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  apiRoutes.put('/:id', (req, res, next) => {
    messageController.updateMessage(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  //apiRoutes.get('/', api.listMessages);
};
