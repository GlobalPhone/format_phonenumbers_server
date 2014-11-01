var libphonenumber = require('libphonenumber');
var Q = require('q');
var express = require('express');
var router = express.Router();

function returnWithResult(number, deferred){
    return function(error, result){
        if (error){
            deferred.resolve({
                number:number,
                message:error.message
            });
        }else{
            deferred.resolve({
                number:number,
                result:result
            });
        }
    }
}

function forAllNumbersWithCountryCode(numbers, country_code, format){
    var array = [];
    numbers.forEach(function(number){
        var deferred = Q.defer();
        format(number, 
            country_code, 
            returnWithResult(number, deferred));
        array.push(deferred.promise);
    });
    return Q.all(array);
}

function hasAnError(results){
    return results.some(function(result){ return 'message' in result; });
}

function respondWithJson(res){
    return function(results){
        if (hasAnError(results)){
            res.status(422);
        }
        res.json(results);
    };
}
router.get('/e164/:country_code/:numbers', function(req, res) {
    var numbers = req.params.numbers.split(',');
    var country_code = req.params.country_code;
    forAllNumbersWithCountryCode(numbers, country_code, libphonenumber.e164).then(respondWithJson(res));
});

router.get('/intl/:country_code/:numbers', function(req, res) {
    var numbers = req.params.numbers.split(',');
    var country_code = req.params.country_code;
    forAllNumbersWithCountryCode(numbers, country_code, libphonenumber.intl).then(respondWithJson(res));
});

router.post('/e164/:country_code', function(req, res) {
    var numbers = req.body.numbers.split(',');
    var country_code = req.params.country_code;
    forAllNumbersWithCountryCode(numbers, country_code, libphonenumber.e164).then(respondWithJson(res));
});

router.post('/intl/:country_code', function(req, res) {
    var numbers = req.body.numbers.split(',');
    var country_code = req.params.country_code;
    forAllNumbersWithCountryCode(numbers, country_code, libphonenumber.intl).then(respondWithJson(res));
});

module.exports = router;
