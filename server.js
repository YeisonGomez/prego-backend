var express     = require('express');
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    fs          = require('fs'),  
    config      = require('./config');
    auth        = require('./services/middleware_private_user'),
    request     = require("request");

var server      = express();
    firebase    = config.firebase;
    router      = express.Router();
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())
    server.use(cors())
    server.use('/', require('./routes'));
    server.use('/', express.static(__dirname+'/public/'));

server.listen(config.server.port, config.server.ip, function(){
    console.log('Servidor corriendo en ' + config.server.ip + ':' + config.server.port );
});
