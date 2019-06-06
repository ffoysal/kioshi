module.exports.init = (app, express) => {
  const YAML = require('yamljs');
  const config = require('../config/config.js');
  const swaggerUi = require('swagger-ui-express');
  const routerSwagger = express.Router();
  // reference from root folder path
  const options = YAML.load('./swagger/swagger.yaml');


  options.host = config.swaggerHostURI || 'localhost:' + config.serverPort;

  routerSwagger.use('/', swaggerUi.serve, swaggerUi.setup(options));
  app.use('/docs', routerSwagger);
};