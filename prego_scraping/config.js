var firebase = require("firebase");

firebase.initializeApp({
    serviceAccount: "./path/to/Prego-ede92e259ab0.json",
    databaseURL: "https://prego-22e63.firebaseio.com/"
});

module.exports = {
    firebase: firebase,

    server: {
        //ip: '104.236.225.92',
        ip: 'localhost',
        port: 8099
    }
}
