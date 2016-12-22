'use strict';

var express = require('express');
var router = express.Router();
const path = require('path');
var imagefilepathname = path.join(__dirname, 'imageupload');
router.get('/', (req, res, next) => {
    //todo, just mock an API endpoint
    res.json({ "JonSnow": "You know nothing" })
})

router.post('/upload', function(req, res) {
    var sampleFile;
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    var f = req.files;
    res.send('Actually can upload');
    f.file.mv(imagefilepathname, function(err) {
        if (err) {
            console.log('error', err);
            // res.status(500).send(err);
        } else {
            res.send('File uploaded!');
        }
    });
});
module.exports = router;