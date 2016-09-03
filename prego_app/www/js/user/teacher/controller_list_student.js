/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.controller('listStudentCtrl', function($scope, $rootScope, $ionicPopup, $state, $cordovaSQLite, $cordovaNetwork, listStudentService) {

    var vari;
    $scope.isConnectionDBList = false;
    $rootScope.loading(10);
    $rootScope.grades = [];
    $scope.nameActivity = "Actividad 1";

    $scope.modalCalification = function(user) {
        if ($rootScope.user.rol == "Docente") { //Cambiar a docente
            if ($scope.nameActivity.length > 1) {
                var alertPopup = $ionicPopup.prompt({
                    title: $scope.nameActivity,
                    subTitle: user.name,
                    cssClass: 'style-modal',
                    template: ' ',
                    inputType: 'number',
                    inputPlaceholder: 'Agregar nota',
                    maxLength: '4',
                    cancelText: 'Cancelar',
                    cancelType: 'button-outline color-amber',
                    okText: 'Calificar',
                    okType: 'button-royal'
                }).then(function(nota) {
                    if (nota != undefined) {
                        fbSaveCalification(user.id, nota);
                    }
                });
            } else {
                $rootScope.messageNotification("Agregar el nombre de la actividad");
            }
        }
    }

    //Docente
    var getActivitys = function() {
        if ($cordovaNetwork.isOnline()) {
            listStudentService.getActivitys($state.params.id, function(actividades) {
                $rootScope.grades = actividades;
                for (var i = 0; i < actividades.length; i++) {
                    insertDBActivitys(actividades[i].nameActivity)
                }
            });
        } else {
            $rootScope.messageNotification("No tienes conexion a internet");
            notConnectTeacher();
        }
    }

    var notConnectTeacher = function() {
        try {
            var query = "SELECT * FROM grades WHERE grades_id = ?";
            $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        $rootScope.grades.push({
                            nameActivity: result.rows.item(i).nameActivity
                        });
                    }
                }
            }, function(error) {
                console.error(error);
            });
        } catch (err) {
            console.log(err);
            console.log("Error al guardar datos en local");
        }
    }

    var insertDBActivitys = function(nameActivity) {
        try {
            var query = "SELECT * FROM grades WHERE grades_id = ?";
            $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
                if (result.rows.length <= 0) {
                    var query = "INSERT INTO grades (grades_id, nameActivity) VALUES (?, ?)";
                    $cordovaSQLite.execute(db, query, [$state.params.id, nameActivity]).then(function(result3) {
                        //console.log("INSERT ID -> " + obj.nameActivity);
                    }, function(error) {
                        console.error(error);
                    });
                } else {
                    var query = "UPDATE grades SET nameActivity = ? WHERE grades_id = ?";
                    $cordovaSQLite.execute(db, query, [nameActivity, $state.params.id]).then(function(result2) {
                        //console.log("UPDATE -> " + obj.nameActivity);
                    }, function(error) {
                        console.log(error);
                    });
                }
            }, function(error) {
                console.error(error);
            });
        } catch (err) {
            console.log(err);
            console.log("Error al guardar datos en local");
        }
    }


    //Estudiante
    $rootScope.promedyAll = function() {
        var all = 0;
        for (var i = 0; i < $rootScope.grades.length; i++) {
            all += parseFloat($rootScope.grades[i].grade);
        }
        var text = (all / $rootScope.grades.length) + '  ';
        if (all != 0) {
            return text.substring(0, 3);
        } else {
            return "0";
        }
    }

    $scope.notConnectGradesStudents = function(student_id) {
        try {
            var query = "SELECT * FROM grades WHERE student_id = ? AND group_id = ?";
            $cordovaSQLite.execute(db, query, [student_id, $state.params.id]).then(function(result) {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        //console.log(result.rows.item(i));
                        $rootScope.grades.push({
                            nameActivity: result.rows.item(i).nameActivity,
                            grade: result.rows.item(i).grade
                        });
                    }
                }
            }, function(error) {
                console.error(error);
            });
        } catch (err) {
            console.log(err);
            console.log("Error al guardar datos en local");
        }
    }

    $scope.getGrades = function() {
        if ($cordovaNetwork.isOnline()) {
            listStudentService.getCalification($state.params.id, $rootScope.user.id, function(res) {
                if (res != "No tiene notas actualmente") {
                    for (var i = 0; i < res.length; i++) {
                        $rootScope.grades.push(res[i].val);
                        insertDB({
                            key: res[i].key,
                            group_id: $state.params.id,
                            student_id: $rootScope.user.id,
                            nameActivity: res[i].val.nameActivity,
                            grade: res[i].val.grade
                        });
                    }
                }
            });
        } else {
            $rootScope.messageNotification("No tienes conexion a internet");
            $scope.notConnectGradesStudents($rootScope.user.id);
        }
    }

    if ($rootScope.user.rol == "Estudiante") {
        $scope.getGrades();
    } else {
        getActivitys();
    }

    var insertDB = function(obj) {
        try {
            var query = "SELECT * FROM grades WHERE grades_id = ?";
            $cordovaSQLite.execute(db, query, [obj.key]).then(function(result) {
                if (result.rows.length <= 0) {
                    var query = "INSERT INTO grades (grades_id, group_id, student_id, nameActivity, grade) VALUES (?, ?, ?, ?, ?)";
                    $cordovaSQLite.execute(db, query, [obj.key, obj.group_id, obj.student_id, obj.nameActivity, obj.grade]).then(function(result3) {
                        //console.log("INSERT ID -> " + obj.nameActivity);
                    }, function(error) {
                        console.error(error);
                    });
                } else {
                    var query = "UPDATE grades SET grades_id = ?, group_id = ?, student_id = ?, nameActivity = ?, grade = ? WHERE grades_id = ?";
                    $cordovaSQLite.execute(db, query, [obj.key, obj.group_id, obj.student_id, obj.nameActivity, obj.grade, obj.key]).then(function(result2) {
                        //console.log("UPDATE -> " + obj.nameActivity);
                    }, function(error) {
                        console.log(error);
                    });
                }
            }, function(error) {
                console.error(error);
            });
        } catch (err) {
            console.log(err);
            console.log("Error al guardar datos en local");
        }
    }

    //Guardar nota
    var fbSaveCalification = function(student_id, grade) {
        if ($cordovaNetwork.isOnline()) {
            $rootScope.loading(7);
            var nameActivity = $scope.nameActivity;
            listStudentService.saveCalification($state.params.id, nameActivity, student_id, grade, function(key) {
                $rootScope.loadingState = false;
            });

        } else {
            $rootScope.loadingState = false;
            $rootScope.messageNotification("No tienes conexion a internet");
            //Guardar en localSotrage hasta que tenga internet
        }
    }

    //MOSTRAR MIEMBROS

    var searchIdMembers = function(arr, n) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key == n) {
                return i;
            }
        }
        return -1;
    }

    $scope.notConnect = function() {
        $rootScope.members = [];
        var query = "SELECT * FROM members";
        $cordovaSQLite.execute(db, query).then(function(result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    //console.log("grupo_id: " + result.rows.item(i).group_id + " id: " + result.rows.item(i).id + " name: " + result.rows.item(i).name);
                    if (searchIdMembers($rootScope.members, result.rows.item(i).group_id) == -1) {
                        $rootScope.members.push({ key: result.rows.item(i).group_id, value: [] });
                    }
                    $rootScope.members[searchIdMembers($rootScope.members, result.rows.item(i).group_id)].value.push({
                        id: result.rows.item(i).id,
                        name: result.rows.item(i).name,
                        rol: result.rows.item(i).rol
                    });
                }
                //console.log($rootScope.members);
            } else {
                $scope.isConnectionDBList = true;
                //console.log("No encuentra los miembros en la base de datos");
            }
        }, function(error) {
            console.error(error);
        });
    }

    var downloadMemebers = function(fireDB, i, callback) {
        if (i + 1 <= $rootScope.subjects.length) {
            fireDB.ref('group/' + $rootScope.subjects[i].id + '/member').once('value', function(snapshot) {
                $rootScope.members.push({
                    key: $rootScope.subjects[i].id,
                    value: []
                });

                snapshot.forEach(function(data) {
                    if (data.val().rol != "Docente") {
                        $rootScope.members[i].value.push({
                            id: data.key,
                            name: $rootScope.formatName(data.val().name),
                            rol: data.val().rol
                        });
                        //console.log("Guardando.." + $rootScope.formatName(data.val().name) + " en " + $rootScope.subjects[i].name);
                        $scope.insertGroupStudent($rootScope.subjects[i].id, data.key, $rootScope.formatName(data.val().name), data.val().rol);
                    }
                });
                downloadMemebers(fireDB, i + 1, callback);
            });
        } else {
            callback();
        }
    }

    $scope.initList = function() {
        if ($rootScope.members == undefined || $rootScope.members.length == 0) {

            if ($cordovaNetwork.isOnline()) {
                if (firebase == undefined) {
                    firebase.initializeApp(config);
                }
                $rootScope.members = [];
                downloadMemebers(firebase.database(), 0, function() {
                    if ($rootScope.members.length == 0) {
                        $scope.notConnect();
                    }
                    $rootScope.loadingState = false;
                });
            } else {
                try {
                    firebase.initializeApp(config);
                    $rootScope.members = [];
                    downloadMemebers(firebase.database(), 0, function() {
                        $rootScope.loadingState = false;
                    });
                } catch (err) {
                    $rootScope.messageNotification("No tienes conexion a internet");
                    $scope.notConnect();
                    $rootScope.loadingState = false;
                }

            }
        }
    }
    $scope.initList();


    $scope.insertGroupStudent = function(group_id, id, name, rol) {
        try {
            var query = "SELECT * FROM members WHERE group_id = ?";
            $cordovaSQLite.execute(db, query, [group_id]).then(function(result) {
                if (result.rows.length > 0) {
                    var query = "UPDATE members SET id = ?, name = ?, rol = ? WHERE group_id = ? AND id = ?";
                    $cordovaSQLite.execute(db, query, [id, name, rol, group_id, id]).then(function(result2) {
                        //console.log("UPDATE -> " + name);
                    }, function(error) {
                        console.error(error);
                    });
                } else { //Guarda
                    var query = "INSERT INTO members (group_id, id, name, rol) VALUES (?, ?, ?, ?)";
                    $cordovaSQLite.execute(db, query, [group_id, id, name, rol]).then(function(result3) {
                        //console.log("INSERT ID -> " + name);
                    }, function(error) {
                        console.error(error);
                    });
                }
            }, function(error) {
                console.error(error);
            });
        } catch (err) {
            console.log(err);
            console.log("Error al guardar datos en local");
        }
    }

    $rootScope.subjectNow = function() {
        var temp = "";
        for (var i = 0; i < $rootScope.members.length; i++) {
            if (temp != $rootScope.members[i].value.id && $rootScope.members[i].key == $state.params.id) {
                temp = $rootScope.members[i].value.id;
                return $rootScope.members[i].value;
            }
        }
    }

});
