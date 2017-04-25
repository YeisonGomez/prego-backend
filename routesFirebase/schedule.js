var db = firebase.database();
var group = db.ref("group");
var userDB = db.ref("user");

var generatePreiod = function() {
    var age = new Date().getFullYear();
    if (new Date().getMonth() >= 6) {
        return age + " - 2";
    } else {
        return age + " - 1";
    }
}

exports.isGroup = function(user) {
    for (var i = 0; i < user.schedule.length; i++) {
        if(user.schedule[i] != undefined){
            controlGroup(user, user.schedule[i], generateCodeGroup(generatePreiod(), user.schedule[i]));
        }
    }
}

//Verificar, agregar, o crear el grupo
var controlGroup = function(user, schedule, codeGroup) {
    getIdTeacher(user.listTeachers, schedule.resource[0].teacher, function(idTeacher) {
        group.orderByKey().equalTo(codeGroup).once("value", function(snapshot) {
            if (snapshot.val() != null) {
                //agrega un miembbro
                //console.log("Ya existe el grupo");
                var rol = (idTeacher.id == user.nameStudent)? "Docente" : "Estudiante";
                db.ref("group/" + codeGroup + "/member").child(user.codeStudent).update({
                    name: user.nameStudent,
                    rol: rol
                });
                //Agregar ids grupos Estudiante
                db.ref("user/" + user.codeStudent + "/group").child(codeGroup).update({
                    name: schedule.name
                });

                if (idTeacher.id != "SD" && rol != "Docente") {
                    //Agregar al docente como miembro
                    db.ref("group/" + codeGroup + "/member").child(idTeacher.id).update({
                        name: idTeacher.name.toUpperCase(),
                        rol: "Docente"
                    });
                }
            } else {
                //Crear un nuevo grupo
                group.child(codeGroup)
                    .set({
                        codeSubject: schedule.id,
                        nameSubject: schedule.name.toUpperCase(),
                        period: user.period,
                        group: schedule.group,
                        teacher_id: idTeacher.id,
                        resource: schedule.resource,
                        member: ""
                    });

                var rol = (idTeacher.id == user.nameStudent)? "Docente" : "Estudiante";

                //Se agrega como miembro
                db.ref("group/" + codeGroup + "/member").child(user.codeStudent).set({
                    name: user.nameStudent,
                    rol: rol
                });
                //Agregar grupos Estudiante
                db.ref("user/" + user.codeStudent + "/group").child(codeGroup).update({
                    name: schedule.name.toUpperCase()
                });

                if (idTeacher.id != "SD" && rol != "Docente") {
                    //Agregar docente
                    db.ref("group/" + codeGroup + "/member").child(idTeacher.id).set({
                        name: idTeacher.name,
                        rol: "Docente"
                    });
                }
            }
        });
    });
}

var generateCodeGroup = function(periodo, schedule) {
    var age = periodo.substring(0, 4);
    var period = periodo.substring(7, 8);
    var codeGrupo = 0;
    for (var i = 0; i < schedule.group.length; i++) { //nombre del grupo
        codeGrupo += parseInt(schedule.group.substring(i, i + 1).toUpperCase().charCodeAt(0) + i);
    }

    var codeNameSubject = 0;
    for (var i = 0; i < schedule.name.length; i++) { //Nombre de la materia
        codeNameSubject += parseInt(schedule.name.substring(i, i + 1).toUpperCase().charCodeAt(0) + i);
    }
    var code = age + period + codeNameSubject + codeGrupo;
    return code;
}

var getIdTeacher = function(listDocente, name, callback) {
    name = name.replaceAll(" ", "");
    if (name != "SD") {
        for (var i = 0; i < listDocente.length; i++) {
            if (listDocente[i].name.replaceAll(" ", "").toUpperCase() == name.toUpperCase()) {
                callback(listDocente[i]);
                break;
            } else if ((i + 1) == listDocente.length) {
                callback({ id: "SD", name: name });
                break;
            }
        }
    } else {
        callback({ id: "SD", name: "SD" });
    }
}


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
