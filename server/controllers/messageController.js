const uuidv4 = require('uuid/v4');
const Message = require('../models/message');
const messageService = require('../services/messageService');


exports.createMessage = (req, res, callback) => {

  if ((Object.keys(req.body) && Object.keys(req.body).length !== 1) || !messageService.isMsgValid(req.body.message)) {
    return callback({
      status: 400,
      message: 'invalid message body'
    }, 400);
  }
  let message = new Message({
    _id: uuidv4().split('-').join(''),
    message: req.body.message,
    isPalindrome: messageService.isPalindrome(req.body.message),
    length: messageService.msgLength(req.body.message)
  });

  message.save((err, msg) => {
    if (err) {
      console.log(err.message);
      return callback({
        status: 500,
        message: err.message
      }, 500);
    }
    res.set({ 'Location': '/messages/' + msg._id });
    callback(null, 201, null);
  });
};

exports.getMessage = (req, res, callback) => {
  Message.findById(
    req.params.id,
    function (err, msg) {
      if (err) {
        return callback({
          status: 500,
          message: err.message,
          err: err
        });
      }
      if (msg) {
        return callback(null, 200, msg);
      }
      return callback(null, 404);
    }
  );
};


exports.deleteMessage = (req, res, callback) => {
  Message.findOneAndDelete(
    { _id: req.params.id },
    function (err, deletedMsg) {
      if (err) {
        return callback({
          status: 500,
          message: err.message,
          err: err
        });
      }
      if (deletedMsg) {
        return callback(null, 204);
      }
      return callback(null, 404);
    }
  );
};

exports.updateMessage = (req, res, callback) => {
  Message.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { message: req.body.message, isPalindrome: messageService.isPalindrome(req.body.message), length: messageService.msgLength(req.body.message) } },
    { useFindAndModify: false },
    function (err, msg) {
      if (err) {
        return callback({
          status: 500,
          message: err.message,
          err: err
        });
      }
      if (msg) {
        return callback(null, 204);
      }
      return callback(null, 404);

    }
  );
};

exports.listMessages = (req, res, callback) => {
  let limit = 3, page = 1;
  let requestedPage = req.query.page;
  let requestedLimit = req.query.limit;
  if (requestedPage && requestedPage > 0) {
    page = requestedPage;
  }

  if (requestedLimit && requestedLimit > 0) {
    limit = requestedLimit;
  }
  let options = {
    page: page,
    limit: limit
  };

  Message.paginate({}, options, function (err, result) {
    if (err) {
      return callback({
        status: 500,
        message: err.message,
        err: err
      });
    }
    let msg = {
      messages: result.docs,
      page: result.page,
      totalPage: result.totalPages,
      hasNextPage: result.hasNextPage
    };
    return callback(null, 200, msg);
  });
};