/*Copyright (c) <2016> <Yeison Gomez Rodriguez, Brayan Stiven Tovar Claros>*/
    app.controller('mainCtrl', function($scope, $rootScope, $auth, $location, $state, $ionicSideMenuDelegate, $cordovaSQLite, $ionicPopup, $ionicModal) {

        if ($rootScope.user == undefined) {
            $rootScope.user = {
                id: $auth.getPayload().id,
                name: $scope.formatAllName($auth.getPayload().name),
                user: $auth.getPayload().user,
                program: $scope.formatAllName($auth.getPayload().program),
                rol: $auth.getPayload().rol
            };
        }

        
        $scope.inputSms = false;
        $scope.isWall = function() {
            return $location.path().split("/")[2] != 'wall';
        } 

        $scope.logout = function() {
            //$cordovaSQLite.deleteDB("prego.db");
            localStorage.clear();
            $scope.viewlogOut = false;
            
            $rootScope.subjects = undefined;
            $state.go("login");
        }

        $scope.viewlogOut = false;
        // if (!$ionicSideMenuDelegate.isOpenLeft()) {
        //    $scope.viewlogOut = false;
        //} 
        //console.log($ionicSideMenuDelegate.$getByHandle('left'));

        $scope.activelogOut = function(viewlogOut) {
            if (!viewlogOut) {
                $scope.viewlogOut = true;
            } else {
                $scope.viewlogOut = false;
            }
        }

        $ionicModal.fromTemplateUrl('modalPromedio', {
            scope: $scope,
            animation: 'slide-in-top'
        }).then(function(modal) {
            $scope.modalProm = modal;
        });

        $ionicModal.fromTemplateUrl('modalConfig', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalConfig = modal;
        });

        $scope.openConfig = function() {
            $scope.modalConfig.show();
        }; 
        $scope.openProm = function() {
            $scope.modalProm.show();
        };
        $scope.closeProm = function() {
            $scope.modalProm.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalProm.remove();
        });

        

        $scope.activities = [
            { name: "Trabajo escrito muy largo", grade: 3.5 },
            { name: "Taller en clase", grade: 5.0 },
            { name: "Parcial 1", grade: 1.2 },
            { name: "Actividad 1", grade: 2.7 }
        ];
    });
