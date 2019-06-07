process.env.ENVIRONMENT = 'test';

/**
 * This is to verify retrive a single message api
 */
let app = require('../server.js');
let request = require('supertest')(app);
let expect = require('chai').expect;

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

  it('Should message length is 7', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.length).to.equal(7);
        done();
      });
  });
});

describe('GET /messages/:id', () => {
  let msgLoc = null;
  before((done) => {
    request
      .post('/messages')
      .send({
        message: 'demo'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        msgLoc = res.header.location;
        done();
      });
  });

  it('Should message be demo', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.message).to.equal('demo');
        done();
      });
  });

  it('Should message not be palindrome', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.isPalindrome).to.false;
        done();
      });
  });

  it('Should message length is 4', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.length).to.equal(4);
        done();
      });
  });
});