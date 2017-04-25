var jwt = require('jwt-simple');
var config = require('../config');
var user = config.firebase.database().ref("user");

exports.authenticateToken = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "Petición no Autorizada" });
    } else {
        var token = req.headers.authorization.split(" ")[1];
        if (token) {
            try {
                var payload = jwt.decode(token, 'pregokey123');
                //console.log(payload);

                user.orderByChild("session").equalTo(token).once("value", function(snapshot) {
                    if(snapshot.val() != null){
                      req.id = payload.id;
                      req.name = payload.name;
                      req.program = payload.program;
                      req.user = payload.user;
                      req.rol = payload.rol;
                      next();

                    }else{
                      return res.status(401).send({message: "El token no es valido"});
                    }
                })
            } catch (err) {
                return res
                    .status(401)
                    .send({
                        message: "El token no es valido"
                    });
            }
        }
    }
}

var getTokenUser = function(){

}
