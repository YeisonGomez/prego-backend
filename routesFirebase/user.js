var db = firebase.database();
var studentFB = db.ref("user");

exports.getSubjects = function(userId, callback) {
    db.ref("user/" + userId + "/group").once("value", function(snapshot) {
        if (snapshot.val() != null) {
            var dato = [];
            snapshot.forEach(function(data) {
                dato.push({id: data.key, name: data.val().name});
            });
            callback(dato);
        } else {
            callback("El usuario no tiene asignaturas actualmente");
        }
    })
}

exports.saveStudent = function(student, token, user) {
    var usersRef = studentFB.child(student.codeStudent);
    usersRef.set({
        user: user,
        name: student.nameStudent,
        program: student.program,
        session: token,
        group: []
    });
    return token;
}

exports.getAll = function() {
    studentFB.on("value", function(snapshot) {
        return snapshot.val();
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
