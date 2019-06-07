process.env.ENVIRONMENT = 'test';

/**
 * This is to verify delete message api works
 */
let app = require('../server.js');
let request = require('supertest')(app);
let expect = require('chai').expect;

describe('PATCH /messages/:id', () => {
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

  it('Should message be "racecar" before update', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body.message).to.be.equal('racecar');
        done();
      });
  });
  it('Should PATCH return 204', (done) => {
    request
      .patch(msgLoc)
      .send({ message: 'message got modified' })
      .expect(204, done);
  });

  it('Should GET return "message got modified"', (done) => {
    request
      .get(msgLoc)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        expect(res.body.message).to.be.equal('message got modified');
        done();
      });
  });
});


describe('DELETE /messages/:id', () => {
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
  it('Should DELETE again /message:id return 404', (done) => {
    request
      .delete(msgLoc)
      .expect(404, done);
  });
  it('Should PATCH again /message:id return 404', (done) => {
    request
      .patch(msgLoc)
      .send({ message: 'just a message' })
      .expect(404, done);
  });

});