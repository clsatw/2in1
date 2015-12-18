'use strict';
angular.module("app")
.constant('authUrl', '/api/auth/')
.controller("app.authCtrl", function ($scope, $http) {
    $scope.user = {};
    $http.get(authUrl + '/getUserProfile').success(function(res) {
        $scope.user.name = res.google.name || res.facebook.name || res.local.name; 
        $scope.user.email = res.google.email || res.facebook.email || res.local.email;;
    });
});
