const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'client'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('./client')); 	
//set up 
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// call routes.js that manage controllers
require('./routes')(app);

//let front end hanlde everything including routing
app.all('/*', function(req, res, next) {
    res.sendFile('client/index.html', { root: __dirname });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('server-error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('server-error', {
        message: err.message,
        error: {}
    });
});



module.exports = app