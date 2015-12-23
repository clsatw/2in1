'use strict';
angular.module("app.cart", [])
.factory("cartService", function () {
    var myCart = new Cart('myStore');
     // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    //myCart.addCheckoutParameters("PayPal", "YTK9ZFNLT4S5Y");    
        
    return {
        cart: myCart
    };
})
.directive("cart", function (cartService) {
    return {
        restrict: "A",
        controller: function($scope, $http) {
            $scope.cart = cartService.cart;  
                      
            $scope.sendPost = function() {
                var data = $scope.cart.cartData;
                $http.post('http://localhost:5000/paypal/pay', {'data': data}).success(function(data, stauts){
                    console.log(data);
                })                
            }            
        },
        templateUrl: function(elem, attrs) {
            return (attrs['cart'] === 'Summary') ? 
                "components/cart/cartSummary.html" : "components/cart/cartDetails.html";         
        }
    }
})