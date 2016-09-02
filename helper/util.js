var jwt = require('jwt-simple');

exports.generateToken = function(token){
 var payload = {
        id: token.id,
        name: token.name,
        user: token.user,
        rol: token.rol,
        program: token.program,
        date: token.date
      }

  return {token: jwt.encode(payload, 'pregokey123')};
};
