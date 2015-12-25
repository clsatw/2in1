'use strict';
angular.module("app")
//.constant('authUrl', '/api/auth/')
.controller("app.authCtrl", function ($scope, $rootScope, $http) {
    $scope.user = {email: '', password: ''};

    $scope.login = function(){
    	$http.post('api/auth/login', $scope.user).success(function(data){
    		$rootScope.auth = true;
    		$rootScope.current_user = data.local.email; // from mongodb    		
    		$location.path('/');
    	});
    }
    $scope.signup = function(){
    	$http.post('api/auth/signup', $scope.user).success(function(data){
    		$rootScope.auth = true;
    		$rootScope.current_user = data.local.email; // from mongodb
    		$location.path('/');
    	});
    }
    /*
    $http.get('/api/auth/getUserProfile').success(function(res) {
        //$scope.user.name = res.google.name || res.facebook.name || res.local.name; 
        $scope.user.email = res.google.email || res.facebook.email || res.local.email;;
    });
	*/
});
