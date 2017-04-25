var fbUser = require('../routesFirebase/user.js');
var fbSchedule = require('../routesFirebase/schedule.js');
var util = require('../helper/util.js');

exports.login = function(req, res) {
    try {
        var headers = {};
        headers['X-Requested-With'] = 'XMLHttpRequest'; //if ajax request
        headers['Content-Type'] = 'application/json; charset=utf-8';
        var options = {
            url: 'http://chaira.udla.edu.co/api/v0.1/oauth2/resource.asmx/scope',
            headers: headers,
            body: JSON.stringify({ access_token: req.body.tok, scope: "public_profile" })
        };

        getProgram(headers, req.body.tok, function(program) {
            request.post(options, function(err, response) {
                if (!err && response.statusCode == 200) {
                    var user = JSON.parse(JSON.parse(response.body.replace('{"d":null}', "")).description);
                    console.log(user[0].CORREO);
                    getSchedulesRol(user, 0, [], { header: headers, token: req.body.tok }, function(schedule) {
                        var schedule2 = parsearSchedule(schedule, user, program); //Horario

                        var student = false,
                            docent = false,
                            job = false;
                        for (var i = 0; i < user.length; i++) {
                            if (user[i].ROL == "ESTUDIANTE") {
                                student = true;
                            } else if (user[i].ROL == "DOCENTE") {
                                docent = true;
                            } else if (user[i].ROL == "FUNCIONARIO") {
                                job = true;
                            }
                        }

                        if (student || docent) {
                            var usuario = user[0].CORREO.split("@")[0];
                            var token = util.generateToken({
                                id: usuario.replace(".", "-"),
                                name: user[0].NOMBRES + " " + user[0].APELLIDOS,
                                user: usuario.replace(".", "-"),
                                program: (!student && docent) ? "Sin Programa" : program,
                                date: new Date().getTime()
                            });

                            fbSchedule.isGroup(schedule2); //Verificar, o agrega un miembro, o crea un grupo

                            if (docent) {
                                res.status(200).send(fbUser.save(schedule2, token, usuario, "Docente"));
                            } else if (student) {
                                res.status(200).send(fbUser.save(schedule2, token, usuario, "Estudiante"));
                            }
                        } else if (job) {
                            res.status(400).send("Lo sentimos Prego no esta disponible para funcionarios.");
                        }
                    });
                } else {
                    res.status(400).send("Lo sentimos ocurrio un error en el servidor");
                }
            });
        });

    } catch (err) {
        res.status(400).send("Lo sentimos ocurrio un error en el servidor");
    }
};

var getProgram = function(headers, access_token, callback) {
    var options2 = {
        url: 'http://chaira.udla.edu.co/api/v0.1/oauth2/resource.asmx/scope',
        headers: headers,
        body: JSON.stringify({ access_token: access_token, scope: "student_academic_information" })
    };
    request.post(options2, function(err2, response2) {
        if (!err2 && response2.statusCode == 200) {
            return callback(JSON.parse(JSON.parse(response2.body.replace('{"d":null}', "")).description)[0].PROGRAMA);
        }
    });
}

var getSchedulesRol = function(user, i, schedule, option, callback) {
    if (user[i].ROL == "ESTUDIANTE") {
        options = {
            url: 'http://chaira.udla.edu.co/api/v0.1/oauth2/resource.asmx/scope',
            headers: option.header,
            body: JSON.stringify({ access_token: option.token, scope: "schedule" })
        };

        request.post(options, function(err2, response2) {
            if (!err2 && response2.statusCode == 200) {
                schedule.push({
                    schedule: JSON.parse(JSON.parse(response2.body.replace('{"d":null}', "")).description),
                    rol: "Estudiante"
                });
                if (i + 1 == user.length) {
                    return callback(schedule);
                } else {
                    return getSchedulesRol(user, i + 1, schedule, option, callback);
                }
            }
        });
    } else if (user[i].ROL == "DOCENTE") {
        options = {
            url: 'http://chaira.udla.edu.co/api/v0.1/oauth2/resource.asmx/scope',
            headers: option.header,
            body: JSON.stringify({ access_token: option.token, scope: "schedule_professor" })
        };
        request.post(options, function(err2, response2) {
            schedule.push({
                schedule: JSON.parse(JSON.parse(response2.body.replace('{"d":null}', "")).description),
                rol: "Docente"
            });
            if (!err2 && response2.statusCode == 200) {
                if (i + 1 == user.length) {
                    return callback(schedule);
                } else {
                    return getSchedulesRol(user, i + 1, schedule, option, callback);
                }
            }
        });
    } else {
        if (i + 1 == user.length) {
            return callback(schedule);
        } else {
            return getSchedulesRol(user, i + 1, schedule, option, callback);
        }
    }
}

var parsearSchedule = function(schedule, user, program) {
    var horario = [];
    var listDocent = [];
    for (var k = 0; k < schedule.length; k++) {
        for (var i = 0; i < schedule[k].schedule.length; i++) {
            var schedule2 = schedule[k].schedule;
            if (schedule2[i] != undefined) {
                listDocent.push({ id: schedule2[i].DOCENTE, name: schedule2[i].DOCENTE });

                var subject = {
                    id: schedule2[i].CODIGO,
                    group: schedule2[i].NOMBREGRUPO,
                    name: schedule2[i].NOMBREMATERIA,
                    resource: [{
                        day: schedule2[i].DIA,
                        hour: schedule2[i].TIEMPO,
                        teacher: schedule2[i].DOCENTE,
                        resource: schedule2[i].NOMENCLATURA
                    }]
                };

                for (var j = i + 1; j < schedule2.length; j++) {
                    if (schedule2[j].CODIGOGRUPO == schedule2[i].CODIGOGRUPO) {
                        subject.resource.push({
                            day: schedule2[j].DIA,
                            hour: schedule2[j].TIEMPO,
                            teacher: schedule2[j].DOCENTE,
                            resource: schedule2[j].NOMENCLATURA
                        });
                        schedule2[j] = undefined;
                    }
                }
                horario.push(subject);
            }
        }
    }

    var totalHorario = {
        nameStudent: user[0].NOMBRES + " " + user[0].APELLIDOS,
        codeStudent: user[0].CORREO.split("@")[0].replace(".", "-"),
        program: program,
        period: generatePreiod(),
        listTeachers: listDocent,
        schedule: horario
    };
    return totalHorario;
}

var generatePreiod = function() {
    var age = new Date().getFullYear();
    if (new Date().getMonth() >= 6) {
        return age + " - 2";
    } else {
        return age + " - 1";
    }
}

exports.getSubjects = function(req, res) {
    fbUser.getSubjects(req.user.replace(".", "-"), function(data) {
        res.status(200).send(data);
    });
}
