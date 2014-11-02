var libphonenumber = require('libphonenumber');
var express = require('express');
var promise = require('bluebird');
var libphonenumber = promise.promisifyAll(require('libphonenumber'));
var _ = require('underscore');
var router = express.Router();

router.get('/:country_code/:number', function(req, res, next) {
    var number = req.params.number;
    process(req.params.number, req.params.country_code, req, res, next);
});

router.get('/', function(req, res) {
    res.render('format', {phonenumber:'',countrycode:''});
});

router.post('/', function(req, res, next) {
    var number = req.body.phonenumber;
    var countrycode = req.body.countrycode||'';
    process(number, country_code, req, res, next);
});

function process(number, country_code, req, res, next) {
    function format(formatter) {
        return libphonenumber[formatter + 'Async'](number, country_code)
            .then(function (result) { var r= { number: number }; r[formatter] = result; return r; })
            .catch(function (err) { res.status(422); return { number: number, message: err.message }; });
    }
 
    return promise.all([format('intl'),format('e164')]).then(function (n) { res.jsonp(_.extend.apply(_,n)); }).catch(next);
}


module.exports = router;
