'use strict';

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    //todo, just mock an API endpoint
    res.json({"JonSnow":"You know nothing"})
})

module.exports = router;