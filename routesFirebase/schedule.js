var db = firebase.database();
var group = db.ref("group");
var userDB = db.ref("user");

exports.isGroup = function(user) {
    for (var i = 0; i < user.schedule.length; i++) {
        controlGroup(user, user.schedule[i], generateCodeGroup(user.period, user.program, user.schedule[i]));
        //Docente
        //Si el docente ya se ha logeado no hace nada.
        //Si ya existe la materia, se agrega
        //Si no existe el grupo: Crea el grupo, se agrega
    }

    //Agregar Docentes en usuario
    for (var i = 0; i < user.listTeachers.length; i++) {
        userDB.child(user.listTeachers[i].id).set({
            user: "",
            name: user.listTeachers[i].name,
            program: "",
            session: "",
        });
    }
}

//Verificar, agregar, o crear el grupo
var controlGroup = function(user, schedule, codeGroup) {
    getIdTeacher(user.listTeachers, schedule.resource[0].teacher, function(idTeacher) {
        group.orderByKey().equalTo(codeGroup).once("value", function(snapshot) {
            if (snapshot.val() != null) {
                //agrega un miembbro
                //console.log("Ya existe el grupo");
                db.ref("group/" + codeGroup + "/member").child(user.codeStudent).update({
                    name: user.nameStudent,
                    rol: "Estudiante"
                });
                //Agregar ids grupos Estudiante
                db.ref("user/" + user.codeStudent + "/group").child(codeGroup).update({
                    name: schedule.name
                });

                //Agregar al docente como miembro
                db.ref("group/" + codeGroup + "/member").child(idTeacher.id).update({
                    name: idTeacher.name,
                    rol: "Docente"
                });

                //Agregar ids grupos Docente
                db.ref("user/" + idTeacher.id + "/group").child(codeGroup).update({
                    name: schedule.name,
                });
            } else {
                //Crear un nuevo grupo
                group.child(codeGroup).set({
                    codeSubject: schedule.id,
                    nameSubject: schedule.name,
                    period: user.period,
                    group: schedule.group,
                    teacher_id: idTeacher.id,
                    resource: schedule.resource,
                    member: ""
                });
                //Se agrega como miembro
                db.ref("group/" + codeGroup + "/member").child(user.codeStudent).set({
                    name: user.nameStudent,
                    rol: "Estudiante"
                });
                //Agregar grupos Estudiante
                db.ref("user/" + user.codeStudent + "/group").child(codeGroup).update({
                    name: schedule.name
                });

                //Agregar docente
                db.ref("group/" + codeGroup + "/member").child(idTeacher.id).set({
                    name: idTeacher.name,
                    rol: "Docente"
                });

                //Agregar ids grupos Docente
                db.ref("user/" + idTeacher.id + "/group").child(codeGroup).update({
                    name: schedule.name
                });
            }
        });
    });
}

var generateCodeGroup = function(periodo, program, schedule) {
    var age = periodo.substring(0, 4);
    var period = periodo.substring(7, 8);
    var codeGrupo = 0;
    for (var i = 0; i < schedule.group.length; i++) {
        codeGrupo += parseInt(schedule.group.substring(i, i + 1).charCodeAt(0) + i);
    }

    var codeNameSubject = 0;
    for (var i = 0; i < schedule.name.length; i++) {
        codeNameSubject += parseInt(schedule.name.substring(i, i + 1).charCodeAt(0) + i);
    }
    var code = age + period + codeNameSubject + codeGrupo + program.length;
    return code;
}

var getIdTeacher = function(listDocente, name, callback) {
    name = name.replaceAll(" ", "");
    if (name != "SD") {
        for (var i = 0; i < listDocente.length; i++) {
            if (listDocente[i].name.replaceAll(" ", "") == name.toUpperCase()) {
                callback(listDocente[i]);
            }
        }
    } else {
        callback("SD");
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
