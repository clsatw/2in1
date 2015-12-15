'use strict';
angular.module("app")
    .controller("ProdDetailCtrl", function ($scope, $routeParams) {
    	$scope.prod = {};
    	$scope.getProduct = function (sku) {
            for (var i = 0; i < $scope.data.products.length; i++) {
                if ($scope.data.products[i]._id == sku)
                    return $scope.data.products[i];
            }
            return null;
        }	
    	$scope.prod = $scope.getProduct($routeParams.productId);
    	
});