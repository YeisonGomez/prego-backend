/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.factory('studentService', function($http, $rootScope) {
    return {

        sendMessage: function(message, group_id, callback) {
            firebase.database().ref('chats/' + group_id + '/student').push(message).then(function() {
                callback("done", message);
            });

        },

        getMessages: function(tam, group_id, addMessage, callback) {
            var fireBD2 = firebase.database().ref('chats/' + group_id + '/student');
            fireBD2.limitToLast(tam + 10).on('child_added', function(data) {
                addMessage({
                    key: data.key,
                    user_name: data.val().name,
                    message: data.val().message,
                    rol: data.val().rol,
                    time: data.val().time
                });
                callback(fireBD2);
            });
            $rootScope.loadingState = false;
        }
    }
});
