
let dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mms-db';

console.log('DB URI from ENV', process.env.MONGODB_URI);
console.log('DB URI', dbUri);

var config = {
  serverPort: 3000,
  mongoDBURI: dbUri,
  mongoDatabaseName: 'mms-db',
  mongoCollection: 'messages',
  swaggerHostURI: process.env.SWAGGER_URI
};

module.exports = config;
