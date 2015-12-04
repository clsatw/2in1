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
        $routeProvider.when("/cart", {
            templateUrl: "../components/cart/cart.html"
        });
        $routeProvider.when("/store", {
            templateUrl: "../views/store.html"
        });
        // $routeParams.productId (see the controller below)
        $routeProvider.when("/products/:productId", {
            templateUrl: "../views/product.html"
        });
        $routeProvider.when("/auth", {
            templateUrl: "../views/auth.html"
        });
        $routeProvider.when('/getUserProfile', {
            controller: 'app.authCtrl',
            templateUrl: '../views/userprofile.html'
        })
        $routeProvider.otherwise({
            templateUrl: "../views/store.html"
        });
    })
    .controller("StoreCtrl", function($scope, dataFactory) {
        // isArry: true to specifies that the response will be json (from mongodb)
        //$scope.productsResource = $resource(dataUrl);  
        $scope.data = {};
        //$scope.user = {};
        $scope.order = {};
        $scope.data.products = dataFactory.query();

        // use routing to pick the selected product
        if ($routeParams.productId != null) {
            $scope.data.product = dataFactory.query($routeParams.ProductId);
    }
    });