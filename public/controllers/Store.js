'use strict';
angular.module('app', ['app.restful', "customFilters", "ngRoute", "ngAnimate", "app.cart"])
    .config(function($routeProvider) {
        /*
        $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
        */
        $routeProvider.when("/complete", {
            templateUrl: "../views/thankYou.html"
        });
        $routeProvider.when("/placeorder", {
            templateUrl: "../views/placeOrder.html"
        });
        $routeProvider.when("/cart", {
            template: "'<div cart='Details'></div>'"
            //templateUrl: "/components/cart/cart.html"
        });
        $routeProvider.when("/store", {
            templateUrl: "/views/store.html",
            controller: 'ProductListCtrl'
        });
        // $routeParams.productId (see the controller below)
        $routeProvider.when("/products/:productId", {
            templateUrl: "/views/product.html",
            controller: 'ProdDetailCtrl'            
        });
        $routeProvider.when("/auth", {
            templateUrl: "../views/auth.html"
        });
        $routeProvider.when('/getUserProfile', {
            controller: 'app.authCtrl',
            templateUrl: '../views/userprofile.html'
        });
        $routeProvider.otherwise({
            controller: 'ProductListCtrl',
            templateUrl: "/views/store.html"
        });
    })
    .constant('myConfig', {        
        'BaseUrl': 'localhost',
        'port': '5000'
    })     
    .constant('USER', 'sdk-three_api1.sdk.com')
    .constant('PWD', 'QFZCWN5HZM8VBG7Q')
    .constant('SIGNATURE', 'A-IzJhZZjhg29XQ2qnhapuwxIDzyAZQ92FRP5dqBzVesOkzbdUONzmOU')
    .controller("StoreCtrl", function($scope, dataFactory, cartService, myConfig) {
        // isArry: true to specifies that the response will be json (from mongodb)
        //$scope.productsResource = $resource(dataUrl);  
        $scope.data = {};
        //$scope.user = {};
        $scope.order = {};
        $scope.data.products = dataFactory.query(); 

        $scope.add2Cart = function (product) {
            cartService.cart.addItemToCart(product._id, product.name, product.price);
        }
    });