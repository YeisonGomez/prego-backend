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
    },

    db: {
        host: process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
        user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'adminfvkL8Cg',
        password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'lgTebtGY8usP',
        port: process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',
        database: process.env.OPENSHIFT_GEAR_NAME || 'barbershop'
    },
}
