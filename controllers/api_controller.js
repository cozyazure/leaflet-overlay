'use strict';

var express = require('express');
const server = express();
var router = express.Router();
const path = require('path');
var imagefilepathname = path.join(__dirname, 'imageupload');

const db = require('../config/db_connection')[server.get('env')];

router.get('/', (req, res, next) => {
    //todo, just mock an API endpoint
    res.json({ "JonSnow": "You know nothing" })
})

router.post('/uploadMarkers',function(req,res,next){
    db.one('INSERT INTO markers(owner,imagename,opacity,lat,lng,icon,draggable,isonline,iconangle,sharewith) '+
    'VALUES (${owner},${imagename},${opacity}::decimal,${lat},${lng},${icon},${draggable},${isonline},${iconangle},${sharewith}::text[])' + 
     'RETURNING *',req.body)
     .then(function(result){
         return res.json(result);
     },function(error){
         return res.status(500).json({"Error":"DB Error"});
     })
})
module.exports = router;