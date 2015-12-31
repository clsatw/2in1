'use strict';
angular.module("app")
//.constant('authUrl', '/api/auth/')
.controller("app.authCtrl", function ($scope, $rootScope, $http, $location) {
    $scope.user = {email: '', password: ''};

    $scope.login = function(){
        return $http({
            method: 'POST',
            url: 'api/auth/login',            
            data: {email: $scope.user.email, password: $scope.user.password}
            }).success(function(data) {
                $rootScope.auth = true;
                $rootScope.current_user = data.local.email; // from mongodb 
    	 		$location.path('/');
    	});
    }

    $scope.signup = function(){
        // $http post has to be like this; otherwise, node will return 400
    	return $http({
            method: 'POST',
            url: 'api/auth/signup',            
            data: {
                email: $scope.user.email,
                password: $scope.user.password}
            }).success(function(data) {
                $rootScope.auth = true;
    		    $rootScope.current_user = data.local.email; // from mongodb    		
    	});
    }
    /*
    $http.get('/api/auth/getUserProfile').success(function(res) {
        //$scope.user.name = res.google.name || res.facebook.name || res.local.name; 
        $scope.user.email = res.google.email || res.facebook.email || res.local.email;;
    });
	*/
});
