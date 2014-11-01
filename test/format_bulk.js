var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var app = require('../app');

var url = 'http://localhost:3001';
describe('Format Bulk', function() {
  var server;
  before(function () {
    server = app.listen(3001);;
  });
  after(function () {
    server.close();
  });

  describe('e164',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '124311';
      request(url)
        .post('/format_bulk/e164/'+country_code)
        .send({numbers:number})
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
        .post('/format_bulk/e164/'+country_code)
        .send({numbers:number})
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.body[0].result.should.equal('+46767201010');
          done();
        });
    });
  });

  describe('intl',function(){
    it('should return error trying get invalid number', function(done) {
      var country_code = 'SE';
      var number = '124311';
      request(url)
        .post('/format_bulk/intl/'+country_code)
        .send({numbers:number})
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
        .post('/format_bulk/intl/'+country_code)
        .send({numbers:number})
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.body[0].result.should.equal('+46 76 720 10 10');
          done();
        });
    });

  });

});
