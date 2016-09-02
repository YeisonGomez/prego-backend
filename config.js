var firebase = require("firebase");

firebase.initializeApp({
    serviceAccount: "./path/to/Prego-ede92e259ab0.json",
    databaseURL: "https://prego-22e63.firebaseio.com/"
});

module.exports = {
    firebase: firebase,

    server: {
        ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        port: process.env.OPENSHIFT_NODEJS_PORT || 8099
    }
}
