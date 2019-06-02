const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
    },
    isPalindrome: {
      type: Boolean,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastUpdatedAt: {
      type: Date
    }
  },
  {
    versionKey: false
  },
  {
    collection: 'messages'
  }

);

MessageSchema.pre('save', function (next) {
  this.lastUpdatedAt = Date.now();
  next();
});


module.exports = mongoose.model('Message', MessageSchema);