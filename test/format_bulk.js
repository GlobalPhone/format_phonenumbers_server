var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var app = require('../app');

describe('Format Bulk', function() {
  var server;
  before(function () {
    server = app.listen(3001);;
  });
  after(function () {
    server.close();
  });
  function requestFormat(formatter, country_code, numbers){
    var url = 'http://localhost:3001';
    return request(url)
        .post('/format_bulk/'+formatter+'/'+country_code)
        .send({numbers:numbers})
        .expect('Content-Type', /json/);
  }

  describe('e164',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '124311';
      requestFormat('e164', country_code, number)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(422);
          done();
        });
    });
    it('should return formatted number when valid', function(done) {
      var country_code = 'SE';
      var number = '0767201010';
      requestFormat('e164', country_code, number)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body[0].result.should.equal('+46767201010');
          done();
        });
    });
    it('should handle multiple numbers', function(done) {
      var country_code = 'SE';
      var numbers = '0767201010,0767201011,0767201012,0767201013,0767201014';
      requestFormat('e164', country_code, numbers)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.length.should.equal(5);
          res.body[0].result.should.equal('+46767201010');
          res.body[4].result.should.equal('+46767201014');
          done();
        });
    });

  });

  describe('intl',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '124311';
      requestFormat('intl', country_code, number)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(422);
          done();
        });
    });
    it('should return formatted number when valid', function(done) {
      var country_code = 'SE';
      var number = '0767201010';
      requestFormat('intl', country_code, number)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body[0].result.should.equal('+46 76 720 10 10');
          done();
        });
    });

  });

});
