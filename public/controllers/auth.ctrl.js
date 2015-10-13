'use strict';
angular.module("app")
.constant('authUrl', 'http://localhost:3000/api/auth/')
.controller("app.authCtrl", function ($scope, $http) {
    $scope.user = {};
    $http.get('http://localhost:3000/api/auth/getUserProfile').success(function(res) {
        $scope.user.name = res.google.name || res.facebook.name || res.local.name; 
        $scope.user.email = res.google.email || res.facebook.email || res.local.email;;
    });
});
