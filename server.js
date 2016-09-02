var express     = require('express');
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    fs          = require('fs'),  
    config      = require('./config');
    auth        = require('./services/middleware_private_user'),
    request     = require("request");

var app      = express();
    firebase    = config.firebase;
    router      = express.Router();
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.use('/', require('./routes'));
    app.use('/', express.static(__dirname+'/public/'));

app.listen(config.app.port, config.app.ip, function(){
    console.log('Servidor corriendo en ' + config.app.ip + ':' + config.app.port );
});
