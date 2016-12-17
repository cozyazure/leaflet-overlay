'use strict';

var api = require('./controllers/api_controller');

module.exports = (app) => {
    app.use('/api', api);
};