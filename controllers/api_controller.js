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

router.post('/uploadMarkers', (req, res, next) => {
    db.one('INSERT INTO markers(owner,imagename,opacity,lat,lng,icon,draggable,isonline,iconangle,sharewith) ' +
            'VALUES (${owner},${imagename},${opacity}::decimal,${lat},${lng},${icon},${draggable},${isonline},${iconangle},${sharewith}::text[])' +
            'RETURNING *', req.body)
        .then((result) => {
            return res.json(result);
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })
})

router.get('/getMarkersByUser/:username', (req, res, next) => {

    var SQL = 'SELECT * FROM markers WHERE owner= $1';
    db.many(SQL, req.params.username).then((result) => {
            //no matchin results, return 401
            if (result === null) {
                return res.status(404).json({ "ErrorMessage": "No such key exists" });
            }
            return res.json(result);
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })

})

function ResolveDbError(error, resFunc) {
    console.log('DB trx error', error);
    return resFunc.staus(500).json({
        "ErrorName": error.name,
        "ErrorCode": error.code,
        "ErrorMessage": error.message
    });

}
module.exports = router;