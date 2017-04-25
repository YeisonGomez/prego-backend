var express = require('express');
    bodyParser = require('body-parser'),
    cors = require('cors'),
    fs = require('fs'),
    config = require('./config');
    auth = require('./services/middleware_private_user'),
    request = require("request"),
    cluster = require('cluster');

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    var app = express();
    firebase = config.firebase;
    router = express.Router();
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.use('/', require('./routes'));
    app.use('/', express.static(__dirname + '/public/'));

    app.listen(config.server.port, config.server.ip, function() {
        console.log('Servidor corriendo en ' + config.server.ip + ':' + config.server.port);
    });
}
