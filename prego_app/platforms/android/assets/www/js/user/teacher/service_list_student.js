/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.factory('listStudentService', function($http) {
    return {

        saveCalification: function(group_id, nameActivity, student_id, grade, callback) {
            firebase.database().ref('grades/' + group_id + '/' + student_id).push({
                nameActivity: nameActivity,
                grade: grade
            }).then(function(key) {
                firebase.database().ref('grades/' + group_id + '/activitys').push({
                    name: nameActivity,
                    grade: grade
                }).then(function(k) {
                    callback(key.path.o[3]);
                });
            });
        },

        getCalification: function(group_id, student_id, callback) {
            firebase.database().ref('grades/' + group_id + "/" + student_id).once('value', function(snapshot) {
                if (snapshot.val() != null) {
                    var grades = [];
                    snapshot.forEach(function(data) {
                        grades.push({ key: data.key, val: data.val() });
                    });
                    callback(grades);
                } else {
                    callback("No tiene notas actualmente");
                }
            });
        },

        getActivitys: function(group_id, callback) {
            firebase.database().ref('grades/' + group_id + '/activitys').once('value', function(snapshot) {
                var activitys = [];
                snapshot.forEach(function(data) {
                    activitys.push({nameActivity: data.val().name, grade: data.val().grade});
                });
                callback(activitys);
            });
        }
    }
});
