const uuidv4 = require('uuid/v4');
const Message = require('../models/message');
const messageService = require('../services/messageService');

// Create a message
exports.createMessage = (req, res, callback) => {

  // do initial validation of the body
  if (!isValidReqBody(req)) {
    return callback({
      status: 400,
      message: 'invalid message body'
    });
  }

  // define the Message model to save into db
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
      });
    }
    res.set({ 'Location': '/messages/' + msg._id });
    callback(null, 201, null);
  });
};

// get a message details with the specified id
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

// delete a message with the specified id
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

// update a message with the specified id
exports.updateMessage = (req, res, callback) => {
  if (!isValidReqBody(req)) {
    return callback({
      status: 400,
      message: 'invalid message body'
    });
  }

  Message.findById(req.params.id, function (err, msg) {
    if (err) {
      return callback({
        status: 500,
        message: err.message,
        err: err
      });
    }
    if (!msg) {
      return callback(null, 404);
    }
    msg.message = req.body.message;
    msg.isPalindrome = messageService.isPalindrome(req.body.message);
    msg.length = messageService.msgLength(req.body.message);
    msg.save(function (err) {
      if (!err) {
        return callback(null, 204);
      }
      else {
        console.log(err);
        return callback(err, 500);
      }
    });
  }
  );
};

// list messages details.
// starting page=1, entries per page(limit=3)
// no palindrome filter applied
exports.listMessages = (req, res, callback) => {
  let limit = 3, page = 1;
  let requestedPage = req.query.page;
  let requestedLimit = req.query.limit;
  let palindromeFlag = req.query.palindrome;
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
  let query = {};
  // only true or false string accepted
  if (palindromeFlag === 'true' || palindromeFlag == 'false') {
    query.isPalindrome = palindromeFlag;
  }

  Message.paginate(query, options, function (err, result) {
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
      totalPages: result.totalPages,
      totalMessages: result.totalDocs,
      hasNextPage: result.hasNextPage
    };
    return callback(null, 200, msg);
  });
};


// verifies if req body is valid or not
let isValidReqBody = function (req) {
  return Object.keys(req.body) &&
    Object.keys(req.body).length === 1 &&
    req.body.message &&
    messageService.isMsgValid(req.body.message);
};