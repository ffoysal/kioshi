/**
 * Define all the routes and operations for /messages
 */

const messageController = require('../controllers/messageController');

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

  apiRoutes.patch('/:id', (req, res, next) => {
    messageController.updateMessage(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });

  apiRoutes.get('/', (req, res, next) => {
    messageController.listMessages(req, res, (err, status, response) => {
      manageResponse(err, status, response, res, next);
    });
  });
};
