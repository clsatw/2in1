﻿'use strict';
angular.module("app.cart", [])
.factory("cartService", function () {
    var myCart = new Cart('myStore');
     // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "YTK9ZFNLT4S5Y");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "500640663394527",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );
        
    return {
        cart: myCart
    };
})
.directive("cart", function (cartService, $http) {
    return {
        restrict: "A",
        controller: function($scope) {
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