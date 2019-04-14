var fs = require('fs');
var express = require('express');
var router = express.Router();

router.post('/add',(req,res) => {
    console.log(req)
}) ;


module.exports = router;