process.env.ENVIRONMENT = 'test';

/**
 * This is to verify create api
 */
let app = require('../server.js');

let request = require('supertest')(app);

let expect = require('chai').expect;

describe('POST /messages [Create a Messages]', () => {
  it('should return 201', (done) => {
    request
      .post('/messages')
      .send({
        message: 'mokul'
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.header).to.include.any.keys('location');
        done();
      });
  });

  it('should return 400 for invalid message', (done) => {
    request
      .post('/messages')
      .send({
        message: 'mokul3'
      })
      .expect(400, done());
  });
  it('should return 400 for message key not in body', (done) => {
    request
      .post('/messages')
      .send({
        msg: 'kayak'
      })
      .expect(400, done());
  });
  it('should return 400 for extra key in body', (done) => {
    request
      .post('/messages')
      .send({
        message: 'mokul',
        'extra': 'extra'
      })
      .expect(400, done());
  });
  it('should return 400 for empty body', (done) => {
    request
      .post('/messages')
      .send()
      .expect(400, done());
  });

});

