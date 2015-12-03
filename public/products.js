angular.module("exampleApp", ["increment", 'app.restful', 'ngRoute']) 
    .config(function($routeProvider, $locationProvider) {
        /* Always specify the value of the templateUrl with a leading / character. If you do not, the URL will be evaluated
        ** relative to the value returned by the $location.path method, and changing this value is one of the key activities required
        ** when using routing. Without the / character, you will quickly generate a Not Found error as you navigate within
        ** the application.
        */
        //$locationProvider.html5Mode(true);
        $routeProvider.when("/list", {
            templateUrl: "/tableView.html"
        });
        $routeProvider.when("/edit/", {
            templateUrl: "/editorView.html"
        });
        $routeProvider.when("/create", {
            templateUrl: "/editorView.html"
        });
        $routeProvider.otherwise({
            templateUrl: "/tableView.html"
        });
    })
    .controller("defaultCtrl", function($scope, $location, dataFactory) {

        $scope.displayMode = "list";
        $scope.currentProduct = null;     

        $scope.listProducts = function() {
            dataFactory.get().success(function(res) {
                $scope.products = res;
            })
        }

        $scope.deleteProduct = function(product) {
            // it is important to pass in product._id
            dataFactory.delete(product).success(function() {            
                $scope.products.splice($scope.products.indexOf(product), 1);
            });
            //$scope.displayMode = "list";
            $location.path('/list');
        }

        $scope.createProduct = function(product) {
            dataFactory.create(product).success(function(res) {
                $scope.products.push(res);
                //$scope.displayMode = "list";
                $location.path('/list'); 
            });           
        }

        $scope.updateProduct = function(product) {
            dataFactory.update(product).then(function(res){
                $location.path('/list');
            },
            function(err) {
                console.err(err);
            });
            //$scope.displayMode = "list";            
        }

        $scope.editProduct = function(product) {
            angular.copy(product, $scope.currentProduct);
            $location.path('/edit');
        }

/*
        $scope.editOrCreateProduct = function(product) {
            $scope.currentProduct = product ? product : {};
            $scope.displayMode = "edit";
        }
*/
        // project is an object containg methods.
        $scope.saveEdit = function(product) {
            // bear in mind that in mongodb id is "_id"
            if (angular.isDefined(product._id)) {
                // edit existent item
                $scope.updateProduct(product);
            } else {
                // new item
                $scope.createProduct(product);
            }
            $scope.currentProduct = {};
        }

        $scope.cancelEdit = function() {
            if ($scope.currentProduct && $scope.createProduct.$get) {
                $scope.currentProduct.$get();
            }
            $scope.currentProduct = {};
            //$scope.displayMode = "list";
            $location.path('/list');
        }

        $scope.listProducts();
    });