process.env.ENVIRONMENT = 'test';

let ms = require('../services/messageService');
//let config = require("./test_variables.js");
//let request = require('supertest');
//let assert = require('chai').assert;
let expect = require('chai').expect;

describe('Message Service Unit Test', () => {
  let p = 'racecar';
  it('should ' + p + ' be palindrome', (done) => {
    expect(ms.isPalindrome(p)).to.true;
    done();
  });

  it('should null value not be palindrome', (done) => {
    expect(ms.isPalindrome(null)).to.false;
    done();
  });

  it('should empty string not be palindrome', (done) => {
    expect(ms.isPalindrome('')).to.false;
    done();
  });

  it('should "ms" not be a valid msg as min is 3 characters', (done) => {
    expect(ms.isMsgValid('ms')).to.false;
    done();
  });
  it('should "abcdef" be a valid msg', (done) => {
    expect(ms.isMsgValid('abcdef')).to.true;
    done();
  });
  it('should "abcdef2" not be a valid msg as only [a-zA-Z] allowed', (done) => {
    expect(ms.isMsgValid('abcdef2')).to.false;
    done();
  });


});