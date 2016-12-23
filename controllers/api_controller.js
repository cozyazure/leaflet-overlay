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

router.post('/upload', function(req, res,next) {
    var sampleFile;
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    var f = req.files;
    db.one('INSERT INTO leafletimage (imageName,imageByte) VALUES (${name},${data}) RETURNING *', f.file)
        .then(function(result) {
            console.log('upload succeed');
            res.json({
                "Message":'succeeded'
            })
        }).then(function(error) {
            console.log('upload error');
            res.json('upload error');
        })
});
module.exports = router;