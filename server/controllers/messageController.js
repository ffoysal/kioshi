const uuidv4 = require('uuid/v4');
const Message = require('../models/message');


// callback parameters are (err, status, responseBody, res, next)
exports.createMessage = (req, res, callback) => {
  let message = new Message({
    _id: uuidv4().split('-').join(''),
    message: req.body.message,
    isPalindrome: isPalindrome(req.body.message),
    length: msgLength(req.body.message)
  });

  message.save((err, msg) => {
    if (err) {
      console.log(err.message);
      return callback({
        status: 400,
        message: err.message
      }, 400);
    }
    res.set({ 'Location': '/messages/' + message._id });
    callback(null, 201, null, res);
  });
};

exports.getMessage = (req, res, callback) => {
  Message.findOne(
    { _id: req.params.id },
    function (err, msg) {
      if (err) {
        return callback({
          status: 404,
          message: err.message,
          err: err
        });
      }
      return callback(null, 200, msg);
    }
  );
};


exports.deleteMessage = (req, res, callback) => {
  Message.findOneAndDelete(
    { _id: req.params.id },
    function (err, deletedMsg) {
      if (err) {
        return callback({
          status: 404,
          message: err.message,
          err: err
        });
      }
      return callback(null, 204);
    }
  );
};

exports.updateMessage = (req, res, callback) => {
  console.log(req.body);
  Message.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { message: req.body.message, isPalindrome: isPalindrome(req.body.message), length: msgLength(req.body.message) } },
    function (err, msg) {
      if (err) {
        return callback({
          status: 404,
          message: err.message,
          err: err
        });
      }
      return callback(null, 204);
    }
  );
};

let isPalindrome = (msg) => {
  let len = Math.floor(msg.length / 2);
  for (let i = 0; i < len; i++)
    if (msg[i] !== msg[msg.length - i - 1])
      return false;
  return true;
};

let msgLength = (msg) => {
  return msg.length;
};


const msgRegex = /\w+$/;

let validateMsg = (msg) => {
  console.log(msgRegex.test(msg), msg);
  return msgRegex.test(msg);
};