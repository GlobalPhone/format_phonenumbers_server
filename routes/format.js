var libphonenumber = require('libphonenumber');
var express = require('express');
var router = express.Router();

router.all('/e164/:country_code/:number', function(req, res) {
    console.log('getting a request');
    var number = req.params.number;
    libphonenumber.e164(number, req.params.country_code, function (error, result) {
        if (error){
            res.status(403);
            res.send(error.message);
        }else{
            res.json({
                number:number,
                e164:result
            });
        }
    });
});

router.all('/intl/:country_code/:number', function(req, res) {
    var number = req.params.number;
    libphonenumber.intl(number, req.params.country_code, function (error, result) {
        if (error){
            res.status(403);
            res.send(error.message);
        }else{
            res.json({
                number:number,
                intl:result
            });
        }

    });
});


module.exports = router;
