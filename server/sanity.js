/**
 * This is for sanity testing purpuse after run a new server 
 * with empty databse. All the test sould pass.
 * TO RUN: mocha sanity.js
 * It is very handy tool to test a new deployment.
 * Just need to change the baseURL below 
 */

let request = require('supertest');
let expect = require('chai').expect;

//Change this url for your deployment
let baseURL = 'http://localhost:3000';

request = request(baseURL);

describe('GET /messages/:id', () => {
  let msgLoc = null;
  before((done) => {
    request
      .post('/messages')
      .send({
        message: 'racecar'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        msgLoc = res.header.location;
        console.log('Created: ', msgLoc);
        done();
      });
  });

  it('Should return 200', (done) => {
    request
      .get(msgLoc)
      .expect(200, done);
  });
  it('Should message be racecar', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        console.log(res.body);
        expect(res.body.message).to.equal('racecar');
        done();
      });
  });

  it('Should message be palindrome', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.isPalindrome).to.true;
        done();
      });
  });
  it('Should PATCH return 204', (done) => {
    request
      .patch(msgLoc)
      .send({ message: 'abcdef' })
      .expect(204, done);
  });
  it('Should message be abcdef', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        console.log(res.body);
        expect(res.body.message).to.equal('abcdef');
        done();
      });
  });

  it('should return 1 messages', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        console.log(res.body);
        expect(res.body.messages.length).to.be.equal(1);
        expect(res.body.hasNextPage).to.be.false;
        done();
      });
  });
  it('Should DELETE return 204', (done) => {
    request
      .delete(msgLoc)
      .expect(204, done);
  });
  it('Should GET /message:id return 404', (done) => {
    request
      .get(msgLoc)
      .expect(404, done);
  });
});