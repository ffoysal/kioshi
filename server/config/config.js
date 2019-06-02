var config = {
  serverPort: 3000,
  mongoDBURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mms-db',
  mongoDatabaseName: process.env.MONGODB_URI || 'mms-db',
  mongoCollection: 'messages'
};

module.exports = config;
