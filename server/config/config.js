
let dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mms-db';

console.log('DB URI from ENV', process.env.MONGODB_URI);
console.log('DB URI', dbUri);

var config = {
  serverPort: 3000,
  mongoDBURI: dbUri,
  mongoDatabaseName: process.env.MONGODB_URI || 'mms-db',
  mongoCollection: 'messages'
};

module.exports = config;
