process.env.ENVIRONMENT = 'test';

/**
 * This is to test health check end point
 */
let app = require('../server.js');

let request = require('supertest')(app);

describe('GET /health', () => {
  it('should render 200', (done) => {
    request
      .get('/health')
      .expect(200)
      .expect({
        content: 'Server is up and running'
      })
      .end(done);
  });
});