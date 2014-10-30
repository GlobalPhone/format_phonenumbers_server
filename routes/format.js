var libphonenumber = require('libphonenumber');
var express = require('express');
var router = express.Router();

function return_result(number,res){
    return function(error, result){
        if (error){
            res.status(403);
            res.send(error.message);
        }else{
            res.json({
                number:number,
                result:result
            });
        }
    }
}

router.all('/e164/:country_code/:number', function(req, res) {
    var number = req.params.number;
    libphonenumber.e164(number, 
        req.params.country_code, 
        return_result(number, res));
});

router.all('/intl/:country_code/:number', function(req, res) {
    var number = req.params.number;
    libphonenumber.intl(number, 
        req.params.country_code, 
        return_result(number, res));
});

module.exports = router;
