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

router.post('/uploadMarker', (req, res, next) => {
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
    db.manyOrNone(SQL, req.params.username).then((result) => {
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

router.put('/updateMarkerGeoCoordById', (req, res, next) => {
    db.one('UPDATE markers SET lat = ${lat}, lng=${lng} WHERE id = ${id} RETURNING *',req.body)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })
})

router.put('/updateMarkerSharedWith', (req, res, next) => {

})

function ResolveDbError(error, resFunc) {
    console.log('DB trx error', error);
    return resFunc.status(500).json({
        "ErrorName": error.name,
        "ErrorCode": error.code,
        "ErrorMessage": error.message
    });

}
module.exports = router;