var libphonenumber = require('libphonenumber');
var express = require('express');
var router = express.Router();

function return_result_json(number,res){
    return function(error, result){
        if (error){
            res.status(403);
            res.json({
                number:number,
                message:error.message
            });
        }else{
            res.json({
                number:number,
                result:result
            });
        }
    }
}

function return_result(number, countrycode, res){
    return function(error, result){
        if (error){
            res.status(403);
            res.render('user_error', {
                message: error.message,
            });
        }else{
            res.render('format', {phonenumber: number, countrycode: countrycode, result: result});
        }
    }
}

router.get('/', function(req, res) {
    res.render('format', {phonenumber:'',countrycode:''});
});

router.post('/', function(req, res) {
    var number = req.body.phonenumber;
    var countrycode = req.body.countrycode||'';
    libphonenumber.intl(number, 
        countrycode, 
        return_result(number, countrycode, res));
});

router.get('/e164/:country_code/:number', function(req, res) {
    var number = req.params.number;
    libphonenumber.e164(number, 
        req.params.country_code, 
        return_result_json(number, res));
});

router.get('/intl/:country_code/:number', function(req, res) {
    var number = req.params.number;
    libphonenumber.intl(number, 
        req.params.country_code, 
        return_result_json(number, res));
});

module.exports = router;
