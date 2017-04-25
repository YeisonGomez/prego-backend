var db = firebase.database();
var studentFB = db.ref("user");

exports.getSubjects = function(userId, callback) {
    db.ref("user/" + userId + "/group").once("value", function(snapshot) {
        if (snapshot.val() != null) {
            var dato = [];
            snapshot.forEach(function(data) {
                dato.push({ id: data.key, name: data.val().name });
            });
            callback(dato);
        } else {
            callback("El usuario no tiene asignaturas actualmente");
        }
    })
}

exports.getSessionChaira = function(user, callback) {
    db.ref("user").orderByChild("user").equalTo(user.toUpperCase()).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            snapshot.forEach(function(data) {
                callback(data.val().sessionChaira, data.val(), data.key);
            });
        } else {
            callback();
        }
    })
}

exports.save = function(student, token, user, rol) {
    var usersRef = studentFB.child(student.codeStudent);
    usersRef.set({
        user: user.toUpperCase(),
        name: student.nameStudent,
        program: (rol == "Docente")? "Docente" : student.program,
        session: token.token,
        group: [],
        rol: rol
    });
    return token;
}

exports.saveDocent = function(teacher, token, user, groups, sessionChaira) {
    var usersRef = studentFB.child(teacher.id);
    usersRef.set({
        user: user.toUpperCase(),
        name: teacher.name,
        program: "",
        session: token.token,
        group: [],
        rol: "Docente"
    });
    return token;
}
