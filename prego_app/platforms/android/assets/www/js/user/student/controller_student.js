/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.controller('studentCtrl', function($scope, $ionicPopup, studentService, $cordovaNetwork, $rootScope, $state, $cordovaSQLite) {

    var vari;
    $scope.messages = "";
    $rootScope.conversationStudent = [];
    $scope.mostConversationStudent = true;
    $scope.isConnectionDBStudent = false;
    $rootScope.loading(10);

    var getRepeat = function(data) {
        for (var i = 0; i < $rootScope.conversationStudent.length; i++) {
            if (data.key == $rootScope.conversationStudent[i].id) {
                return false;
            }
        }
        return true;
    }

    var contMostMessages = 10;
    var setMessage = function(data) {
        if (getRepeat(data)) {
            contMostMessages = 10;
            var rol = classRol(data);
            $rootScope.conversationStudent.push({
                id: data.key,
                user_name: (rol == 'chat-mine')? "Yo:" : data.user_name,
                message: data.message,
                class: classRol(data),
                time: data.time 
            });
            saveMessage(data);
        } else {
            contMostMessages++;
            if (contMostMessages != $rootScope.conversationStudent.length) {
                $scope.mostConversationStudent = false;
            } else {
                $scope.mostConversationStudent = true;
            }
        }
    }

    $scope.limitMessageS = 0;

    $scope.getMessagess = function() {
        $rootScope.loading(8);
        if ($cordovaNetwork.isOnline()) {
            studentService.getMessages($scope.limitMessageS, $state.params.id, setMessage, function(sock) {
                $scope.mostMessages = function() { //Agregar mas mensajes a la vista
                    sock.off();
                    $scope.limitMessageS += 10;
                    $scope.getMessagess();
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
    $scope.sendMessageStudent = function(message) {
        if ($cordovaNetwork.isOnline()) {
            if (!repit && validMessage(message)) {
                $rootScope.loading(6);
                repit = true;
                studentService.sendMessage({
                    name: $rootScope.user.name,
                    message: message,
                    rol: $rootScope.user.rol,
                    time: new Date().getTime()
                }, $state.params.id, function(res, json) {
                    if (res == "done") {
                        $scope.messages = "";
                        document.getElementById("studentInputs").value = "";
                    }else{
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

    var saveMessage = function(data) {
        try {
            var query = "SELECT * FROM chatstudent WHERE group_id = ?";
            $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
                if (result.rows.length >= 10) {
                    var query = "UPDATE chatstudent SET user = ?, message = ?, userol = ?, time = ? WHERE chat_id = ?";
                    $cordovaSQLite.execute(db, query, [data.user_name, data.message, data.rol, data.time, data.key]).then(function(result2) {
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
                        var query = "INSERT INTO chatstudent (group_id, chat_id, user, message, userol, time) VALUES (?, ?, ?, ?, ?, ?)";
                        $cordovaSQLite.execute(db, query, [$state.params.id, data.key, data.user_name, data.message, data.rol, data.time]).then(function(result3) {
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
            console.log(err);
            console.log("Error al guardar datos en local");
        }

    }

    var notConnect = function() {
        var query = "SELECT * FROM chatstudent WHERE group_id = ?";
        $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(result) {
            if (result.rows.length > 0) {
                console.log("Datos locales");
                for (var i = 0; i < result.rows.length; i++) {
                    var rol = classRol({rol: result.rows.item(i).userol, user_name: result.rows.item(i).user});
                    $rootScope.conversationStudent.push({
                        id: result.rows.item(i).chat_id,
                        user_name: (rol == 'chat-mine')? "Yo:": result.rows.item(i).user,
                        message: result.rows.item(i).message,
                        class: rol,
                        time: result.rows.item(i).time
                    });
                }
            } else {
                $scope.isConnectionDBStudent = true;
                //console.log("No encuentra los miembros en la base de datos");
            }
        }, function(error) {
            console.log(error);
        });
    }

    var classRol = function(send) {
        if ($rootScope.user.name == send.user_name) {
            return "chat-mine";
        } else {
            return "chat-other";
        }
    }

    $scope.getMessagess();

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
});
