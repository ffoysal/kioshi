/**
 * Define the schema of the Message object that will be stored into DB
 */


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

// runs before save to update the lastupdated field automaticallly
MessageSchema.pre('save', function (next) {
  this.lastUpdatedAt = Date.now();
  next();
});

MessageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', MessageSchema);