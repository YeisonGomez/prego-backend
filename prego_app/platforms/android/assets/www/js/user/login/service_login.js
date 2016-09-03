/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.factory('loginService', function($http) {

    return {

        login: function(user) {
            return $http.post(api_url + '/user/login', user);
        }

    }
});
