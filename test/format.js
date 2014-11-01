var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var app = require('../app');

var url = 'http://localhost:3002';
describe('Format', function() {
  var server;
  before(function () {
    server = app.listen(3002);;
  });
  after(function () {
    server.close();
  });

  describe('e164',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '124311';
      request(url)
        .get('/format/e164/'+country_code+'/'+number)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(422);
          done();
        });
    });
    it('should return formatted number when valid', function(done) {
      var country_code = 'SE';
      var number = '0767201010';
      request(url)
        .get('/format/e164/'+country_code+'/'+number)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.body.result.should.equal('+46767201010');
          done();
        });
    });
  });

  describe('intl',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '1243';
      request(url)
        .get('/format/intl/'+country_code+'/'+number)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(422);
          done();
        });
    });

    it('should return formatted number when valid', function(done) {
      var country_code = 'SE';
      var number = '0767201010';
      request(url)
        .get('/format/intl/'+country_code+'/'+number)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.body.result.should.equal('+46 76 720 10 10');
          done();
        });
    });
  });

});
