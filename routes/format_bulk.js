var libphonenumber = require('libphonenumber');
var express = require('express');
var router = express.Router();

function return_result(number, res, array, i){
    return function(error, result){
        if (error){
            res.status(403);
            res.send(error.message);
        }else{
            array.push({
                number:number,
                result:result
            });
            if (i===0){
                res.json(array);
            }
        }
    }
}

router.all('/e164/:country_code/:numbers', function(req, res) {
    var numbers = req.params.numbers.split(',');
    var array = [];
    var country_code = req.params.country_code;
    for (var i = numbers.length - 1; i >= 0; i--) {
        libphonenumber.e164(numbers[i], 
            country_code, 
            return_result(numbers[i], res, array, i));
    };
});

router.all('/intl/:country_code/:numbers', function(req, res) {
    var numbers = req.params.numbers.split(',');
    var array = [];
    var country_code = req.params.country_code;
    for (var i = numbers.length - 1; i >= 0; i--) {
        libphonenumber.intl(numbers[i], 
            country_code, 
            return_result(numbers[i], res, array, i));
    };
});

module.exports = router;
