process.env.ENVIRONMENT = 'test';

/**
 * This is to verify get list of messages work properly
 */
let mongoose = require('mongoose');
let app = require('../server.js');
let request = require('supertest')(app);
let expect = require('chai').expect;

describe('GET /messages [empty list]', () => {
  before((done) => {
    mongoose.connection.dropCollection('messages', (err) => {
      if (err) {
        console.log('error delete collection');
      }
      done();
    });
  });

  it('should return empty list', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return err;
        }
        expect(res.body.messages.length).to.be.equal(0);
        expect(res.body.hasNextPage).to.be.false;
        done();
      });
  });
  it('should return hasNextPage false', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return err;
        }
        expect(res.body.hasNextPage).to.be.false;
        done();
      });
  });

});

describe('GET /messages [List messages]', () => {
  before((done) => {
    request.post('/messages').send({ message: 'racecar' }).end(() => {
      request.post('/messages').send({ message: 'this is a test message' }).end(() => {
        request.post('/messages').send({ message: 'another message' }).end(() => {
          request.post('/messages').send({ message: 'kayak' }).end(() => {
            done();
          });
        });
      });
    });

  });

  it('should return 3 messages', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body.messages.length).to.be.equal(3);
        expect(res.body.hasNextPage).to.be.true;
        done();
      });
  });
  it('should return hasNextPage true', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body.hasNextPage).to.be.true;
        done();
      });
  });
  it('should return (?page=2) with one message', (done) => {
    request
      .get('/messages?page=2')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body.messages.length).to.be.equal(1);
        done();
      });
  });

  it('should have keys [messages, page, totalPages, totalMessages,hasNextPage]', (done) => {
    request
      .get('/messages')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body).to.have.keys('messages', 'page', 'totalPages', 'totalMessages', 'hasNextPage');
        done();
      });
  });
});