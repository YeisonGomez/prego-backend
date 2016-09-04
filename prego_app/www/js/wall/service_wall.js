/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.factory('wallService', function($http, $rootScope) {

    return {

        sendMessage: function(message, group_id, callback) {
            firebase.database().ref('chats/' + group_id + '/teacher').push(message).then(function() {
                callback("done", message);
            })
        },

        getMessages: function(tam, group_id, addMessage, callback) {
            try {
                var fireBD = firebase.database().ref('chats/' + group_id + '/teacher');
            } catch (err) {
                firebase.initializeApp(config);
                var fireBD = firebase.database().ref('chats/' + group_id + '/teacher');
            } finally {
                fireBD.limitToLast(tam + 10).on('child_added', function(data) {
                    addMessage({
                        key: data.key,
                        user_name: data.val().name,
                        message: data.val().message,
                        rol: data.val().rol,
                        time: data.val().time
                    });
                    callback(fireBD);
                });
                $rootScope.loadingState = false;
            }

        }

    }
});
