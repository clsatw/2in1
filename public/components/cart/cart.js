'use strict';
angular.module("cart", [])
.factory("cart", function () {
    function Cart(cartName) {
        this.name = cartName;
        this.clearCart = false;
        this.checkoutParameters = {};
        this.cartData = [];
    }
    Cart.prototype.addProduct = function (id, name, price) {
        var addedToExistingItem = false;
        var i;
        for (i = 0; i < this.cartData.length; i+=1) {
            if (this.cartData[i].id == id) {
                this.cartData[i].count++;
                addedToExistingItem = true;
                break;
            }
        }
        if (!addedToExistingItem) {
            this.cartData.push({
                count: 1, id: id, price: price, name: name
            });
        }
    };

    Cart.prototype.removeProduct = function (id) {
        var i;
        for (i = 0; i < cartData.length; i++) {
            if (cartData[i].id == id) {
                cartData.splice(i, 1);
                break;
            }
        }
    };
    Cart.prototype.getProducts = function () {
            return this.cartData;
    };

    var myCart = new Cart('myStore');

    return {
        cart: myCart;
    }
})
.directive("cartSummary", function (cart) {
    return {
        restrict: "E",
        templateUrl: "components/cart/cartSummary.html",
        controller: function ($scope) {

            var cartData = cart.getProducts();

            $scope.total = function () {
                var total = 0;
                for (var i = 0; i < cartData.length; i++) {
                    total += (cartData[i].price * cartData[i].count);
                }
                return total;
            }

            $scope.itemCount = function () {
                var total = 0;
                for (var i = 0; i < cartData.length; i++) {
                    total += cartData[i].count;
                }
                return total;
            }
        }
    };
});

