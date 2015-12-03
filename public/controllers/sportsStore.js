angular.module('app', ['app.restful', "customFilters", "ngRoute", "ngAnimate", "app.cart"])
    //.constant('baseUrl', 'http://localhost:3000/')    
    .config(function($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode({
        //enabled: true,
        //requireBase: false
        //});
        $routeProvider.when("/complete", {
            templateUrl: "../views/thankYou.html"
        });
        $routeProvider.when("/placeorder", {
            templateUrl: "../views/placeOrder.html"
        });
        $routeProvider.when("/checkout", {
            templateUrl: "../views/checkoutSummary.html"
        });
        $routeProvider.when("/products", {
            templateUrl: "../views/productList.html"
        });
        $routeProvider.when("/auth", {
            templateUrl: "../views/auth.html"
        });
        $routeProvider.when('/getUserProfile', {
            controller: 'app.authCtrl',
            templateUrl: '../views/userprofile.html'
        })
        $routeProvider.otherwise({
            templateUrl: "../views/productList.html"
        });
    })
    .controller("sportsStoreCtrl", function($scope, dataFactory) {
        // isArry: true to specifies that the response will be json (from mongodb)
        //$scope.productsResource = $resource(dataUrl);  
        $scope.data = {};
        //$scope.user = {};
        $scope.order = {};
        $scope.data.products = dataFactory.query();
    });