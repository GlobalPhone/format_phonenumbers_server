var express = require('express');
var promise = require('bluebird');
var libphonenumber = promise.promisifyAll(require('libphonenumber'));
var router = express.Router();
 
router.get('/e164/:country_code/:numbers', function(req, res, next) {
    var numbers = req.params.numbers.split(',');
    var country_code = req.params.country_code;
    process('e164', numbers, country_code, req, res, next);
});
 
router.get('/intl/:country_code/:numbers', function(req, res, next) {
    var numbers = req.params.numbers.split(',');
    var country_code = req.params.country_code;
    process('intl', numbers, country_code, req, res, next);
});
 
router.post('/e164/:country_code', function(req, res, next) {
    var numbers = req.body.numbers.split(',');
    var country_code = req.params.country_code;
    process('e164', numbers, country_code, req, res, next);
});
 
router.post('/intl/:country_code', function(req, res, next) {
    var numbers = req.body.numbers.split(',');
    var country_code = req.params.country_code;
    process('intl', numbers, country_code, req, res, next);
});
 
function process(formatter, numbers, country_code, req, res, next) {
    function format(n) {
        return libphonenumber[formatter + 'Async'](n, country_code)
            .then(function (result) { return { number: n, result: result } })
            .catch(function (err) { res.status(422); return { number: n, message: err.message } });
    }
 
    return promise.all(numbers.map(format)).then(function (n) { res.jsonp(n); }).catch(next);
}
 
module.exports = router;