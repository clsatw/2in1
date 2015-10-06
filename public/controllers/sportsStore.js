angular.module("sportsStore", ["customFilters", "cart", "ngResource", "ngRoute", "ngAnimate"])
    .constant("dataUrl", "http://localhost:3000/api/prods") 
    .constant('baseUrl', 'http://localhost:3000/')
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider.when("/complete", {
            templateUrl: "/views/thankYou.html"
        });
        $routeProvider.when("/placeorder", {
            templateUrl: "/views/placeOrder.html"
        });
        $routeProvider.when("/checkout", {
            templateUrl: "/views/checkoutSummary.html"
        });
        // customers need logon before checkout
        /*
        $routeProvider.when("/checkout", {
        templateUrl: "./views/login.html"
        });
        */
        $routeProvider.when("/products", {
            templateUrl: "/views/productList.html"
        });
        $routeProvider.otherwise({
            templateUrl: "/views/productList.html"
        });
    })
    .controller("sportsStoreCtrl", function($scope, $resource, $http, $location, dataUrl) {
        // isArry: true to specifies that the response will be json (from mongodb)
        //$scope.productsResource = $resource(dataUrl);  
        $scope.data = {};
        //$scope.data.products = $scope.productsResource.query();
        /*
        $scope.productsResource = $resource(dataUrl + ":id", {
            id: "@id"
        }, {
            create: {
                method: "POST"
            },
            save: {
                method: "PUT"
            }
        });
        */
        //$scope.products = $scope.productsResource.query();

        $http.get(dataUrl)
            .success(function(data) {
                $scope.data.products = data;
            })
            .error(function(error) {
                $scope.data.error = error;
            });

    });