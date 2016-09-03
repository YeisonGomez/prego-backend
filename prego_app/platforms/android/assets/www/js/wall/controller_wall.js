/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.controller('wallCtrl', function($scope, $ionicSlideBoxDelegate, $state, $rootScope, $cordovaSQLite, wallService, $cordovaNetwork, $ionicScrollDelegate) {

    var vari;
    $scope.message = "";
    $scope.conversation = [];
    $scope.mostConversation = true;
    $scope.limitMessage = 0;
    $scope.isConnectionDBWall = false;

    $scope.isNetWork = function() {
        return $cordovaNetwork.isOnline();
    }

    $rootScope.getNameMembers = function(id) {
        if (id == $rootScope.user.id) {
            return "Yo:"
        } else {
            for (var i = 0; i < $rootScope.members.length; i++) {
                if ($rootScope.members[i].key == $state.params.id) {
                    for (var j = 0; j < $rootScope.members[i].value.length; j++) {
                        if ($rootScope.members[i].value[j].id == id) {
                            return $rootScope.members[i].value[j].name + ":";
                        }
                    }
                }
            }
            return "";
        }
    }

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    }

    var getRepeat = function(data) {
        for (var i = 0; i < $scope.conversation.length; i++) {
            if (data.key == $scope.conversation[i].id) {
                return false;
            }
        }
        return true;
    }
    var contMostMessage = 10;
    var setMessage = function(data) {
        if (getRepeat(data)) {
            contMostMessage = 10;
            $scope.conversation.push({
                id: data.key,
                user_id: data.user_id,
                message: data.message,
                class: classRol(data),
                time: data.time
            });
            saveMessage(data);
        } else {
            contMostMessage++;
            if (contMostMessage != $scope.conversation.length) {
                $scope.mostConversation = false;
            } else {
                $scope.mostConversation = true;
            }
        }
    }

    $scope.getMessages = function() {
        if ($cordovaNetwork.isOnline()) {
            $rootScope.loading(10);
            wallService.getMessages($scope.limitMessage, $state.params.id, setMessage, function(sock) {
                $scope.mostMessage = function() { //Agregar mas mensajes a la vista
                    sock.off();
                    $scope.limitMessage += 10;
                    $scope.getMessages();
                }
                $rootScope.loadingState = false;
            });
        } else {
            $rootScope.messageNotification("No tienes conexion a internet");
            notConnect();
            $rootScope.loadingState = false;
        }
    }

    var repit = false;
    $scope.sendMessage = function(message) {
        if (validMessage(message)) {
            if ($cordovaNetwork.isOnline()) {
                if (!repit) {
                    message = easteregg(message);
                    $rootScope.loading(6);
                    repit = true;
                    wallService.sendMessage({
                        id: $rootScope.user.id,
                        message: message,
                        rol: $rootScope.user.rol,
                        time: new Date().getTime()
                    }, $state.params.id, function(res, json) {
                        if (res == "done") {
                            $scope.message = "";
                            document.getElementById("wallInput").value = "";
                        } else {
                            $rootScope.messageNotification("No tienes conexion a internet");
                        }
                        $rootScope.loadingState = false;
                        repit = false;
                    });
                }
            } else {
                $rootScope.messageNotification("No tienes conexion a internet");
            }
        }
    }

    var saveMessage = function(data) {
        try {
            var query = "SELECT * FROM chateacher WHERE group_id = ?";
            $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
                if (result.rows.length >= 10) {
                    var query = "UPDATE chateacher SET user = ?, message = ?, userol = ?, time = ? WHERE chat_id = ?";
                    $cordovaSQLite.execute(db, query, [data.user_id, data.message, data.rol, data.time, data.key]).then(function(result2) {
                        //console.log("UPDATE -> " + data.message);
                    }, function(error) {
                        console.log(error);
                    });
                } else { //Guarda
                    var exist = false;
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                            if (result.rows.item(i).chat_id == data.key) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        var query = "INSERT INTO chateacher (group_id, chat_id, user, message, userol, time) VALUES (?, ?, ?, ?, ?, ?)";
                        $cordovaSQLite.execute(db, query, [$state.params.id, data.key, data.user_id, data.message, data.rol, data.time]).then(function(result3) {
                            //console.log("INSERT ID -> " + data.message);
                        }, function(error, a) {
                            console.log(error);
                        });
                    }
                }
            }, function(error) {
                console.log(error);
            });


        } catch (err) {
            console.log("Error al guardar datos en local");
        }

    }

    var notConnect = function() {
        var query = "SELECT * FROM chateacher WHERE group_id = ?";
        $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    $scope.conversation.push({
                        id: result.rows.item(i).chat_id,
                        user_id: result.rows.item(i).user,
                        message: result.rows.item(i).message,
                        class: classRol(result.rows.item(i).userol),
                        time: result.rows.item(i).time
                    });
                }
            } else {
                $scope.isConnectionDBWall = true;
                //console.log("No encuentra los miembros en la base de datos");
            }
        }, function(error) {
            console.log(error);
        });
    }

    var classRol = function(send) {
        if ($rootScope.user.rol == "Docente" || send.rol == "Docente") {
            return "chat-professor";
        } else if ($rootScope.user.id == send.user_id) {
            return "chat-mine";
        } else {
            return "chat-other";
        }
    }

    $scope.getMessages();

    $scope.nameSubject = function() {
        if ($rootScope.subjects != undefined) {
            for (var i = 0; i < $rootScope.subjects.length; i++) {
                if ($state.params.id == $rootScope.subjects[i].id) {
                    return $rootScope.formatName($rootScope.subjects[i].name);
                }
            }
        } else {
            return "Asignatura";
        }
    }

    var validMessage = function(message) {
        if(message != undefined){
            for (var i = 0; i < message.length; i++) {
                if (message.substring(i, i + 1) != " " && message.substring(i, i + 1) != "") {
                    return true;
                }
            }
        }
        return false;
    }

    var easteregg = function(message) {
        if (message == "docucha") {
            return "¥ El dominio total del mundo! ¥"
        } else if (message == "kawai") {
            return "Σ ◕ ◡ ◕";
        } else if (message == ".l.") {
            return "┌∩┐";
        } else if (message == "-.-") {
            return "ಠ_ಠ";
        } else if (message == "<3_<3") {
            return "♥◡♥";
        } else if (message == "homero_simpsons") {
            return "¿Homero?, ¿Quién es Homero?, mi nombre es Cosme Fulanito!";
        } else if (message == "._.") {
            return "(￣ー￣)";
        } else if (message == "Tengo muchisimo dinero") {
            return "Tendrá todo el dinero del mundo pero hay algo que nunca podrá comprar... un dinosaurio";
        } else {
            return message;
        }
    }
});