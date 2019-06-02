process.env.ENVIRONMENT = 'test';

let app = require('../server.js');
//let config = require("./test_variables.js");
let request = require('supertest')(app);
//let assert = require('chai').assert;
//let expect = require('chai').expect;

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