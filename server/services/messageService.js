let msgLength = (msg) => {
  return msg.length;
};

exports.isPalindrome = (msg) => {
  if (!msg || msgLength(msg) < 3) {
    return false;
  }
  let len = Math.floor(msg.length / 2);
  for (let i = 0; i < len; i++)
    if (msg[i] !== msg[msg.length - i - 1])
      return false;
  return true;
};


const msgRegex = /[a-zA-z]{3}$/;

exports.isMsgValid = (msg) => {
  return msgRegex.test(msg);
};

exports.msgLength = msgLength;