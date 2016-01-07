//----------------------------------------------------------------
// shopping cart constructor
//
 function Cart(cartName, $win) {
    var win = $win;
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.isCartGetUpdated =false;
    this.cartData = [];

    // load items from local storage when initializing
    this.loadCartData();

    // save items to local storage when unloading
    var self = this;
    // angular.element(window).on('unload', function () {
    angular.element(win).on('unload', function(){
    //$(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveCartData();
        self.clearCart = false;
    }); 
}

Cart.prototype.getProducts = function() {
    return this.cartData;
};

// load items from local storage
Cart.prototype.loadCartData = function () {
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id != null && item.name != null && item.price != null) {
                    this.cartData.push({count: 1, id: item.id, price: item.price, name: item.name});
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
}
// save items to local storage (data will still exist if )
Cart.prototype.saveCartData = function() {
    this.isCartGetUpdated = !this.isCartGetUpdated;
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.cartData);
    }
}

// adds an item to the cart
Cart.prototype.addItemToCart = function(id, name, price) {        
        var addedToExistingItem = false;
        var i;
        for (i = 0; i < this.cartData.length; i++) {
            if (this.cartData[i].id == id) {
                this.cartData[i].count++;
                addedToExistingItem = true;
                break;
            }
        }
        if (!addedToExistingItem) { 
            // we can also create an CartItem obj and push it to cartData           
            this.cartData.push({
                count: 1, id: id, price: price, name: name
            });
        }
        // save changes to local storage
        this.saveCartData();        
}

Cart.prototype.removeItem = function(id) {   
    for (var i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].id == id) {
            this.cartData.splice(i, 1);
            break;
        }
    }
    // save changes to local storage
    this.saveCartData();
}

// get the total price for all items currently in the cart
Cart.prototype.getTotalPrice = function() {
    var total = 0;
    for (var i = 0; i < this.cartData.length; i++) {
        total += (this.cartData[i].price * this.cartData[i].count);
    }
    return total;
}

Cart.prototype.getItemCount = function() {
    var total = 0;
    for (var i = 0; i < this.cartData.length; i++) {
        total += this.cartData[i].count;
    }
    return total;
}
Cart.prototype.isItInCart = function (sku) {
    for (var i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i]._id === sku)
            return true;
    }
    return false;
}   

// clear the cart
Cart.prototype.emptyCart = function() {    
    this.cartData = [];
    this.saveCartData();    // save to local storage
}

