/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
app.controller('loginCtrl', function($scope, $auth, $state, $rootScope, $stateParams, $ionicHistory) {
    $scope.user = {
        user: "",
        password: ""
    };
    var vari;
    var repit = false;
    
    $scope.login = function() {
        if (!repit && $scope.validLogin()) {
            $rootScope.loading(90);
            repit = true;
            $auth.login({
                user: $scope.user.user,
                password: $scope.user.password
            }).then(function(token) {
                if (token.status == 200) {
                    $scope.user = {
                        user: "",
                        password: ""
                    };
                    localStorage.setItem("token", token.data.token);
                    $rootScope.user = {
                        id: $auth.getPayload().id,
                        name: $scope.formatAllName($auth.getPayload().name),
                        user: $auth.getPayload().user,
                        program: $scope.formatAllName($auth.getPayload().program),
                        rol: $auth.getPayload().rol
                    };

                    $ionicHistory.clearCache().then(function(){
                        $state.go("main.subjects");
                    });
                    //Guardar credenciales en local
                } else {
                    $rootScope.messageNotification(token.data.token);
                }
                $rootScope.loadingState = false;
                repit = false;
            }).catch(function(err) {
                repit = false;
                if (err.status == 400) {
                    $rootScope.messageNotification(err.data);
                } else {
                    $rootScope.messageNotification("No hemos podido conectar con el servidor");
                }
                $rootScope.loadingState = false;
            });
        }
    }

    $scope.validLogin = function() {
        return ($scope.user.user.length > 3 && $scope.user.password.length > 2);
    }
});
