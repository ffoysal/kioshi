process.env.ENVIRONMENT = 'test';

let mongoose = require('mongoose');
let app = require('../server.js');
//let config = require("./test_variables.js");
let request = require('supertest')(app);
//let assert = require('chai').assert;
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
});

