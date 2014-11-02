var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var app = require('../app');

describe('Format', function() {
  var server;
  before(function () {
    server = app.listen(3002);;
  });
  after(function () {
    server.close();
  });

  function requestFormat(country_code, number){
    var url = 'http://localhost:3002';
    return request(url)
        .get('/format/'+country_code+'/'+number)
        .expect('Content-Type', /json/);
  }

  it('should return error trying get invalid number', function(done) {
    var country_code = 'SE';
    var number = '124311';
    requestFormat(country_code,number)
      .end(function(err, res) {
        should.not.exist(err);
        res.status.should.equal(422);
        done();
      });
  });
  it('should return formatted number when valid', function(done) {
    var country_code = 'SE';
    var number = '0767201010';
    requestFormat(country_code,number)
      .end(function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.e164.should.equal('+46767201010');
        res.body.intl.should.equal('+46 76 720 10 10');
        done();
      });
  });

});
