//----------------------------------------------------------------
// shopping cart constructor
//
 function Cart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.cartData = [];

    // load items from local storage when initializing
    this.loadCartData();

    // save items to local storage when unloading
    var self = this;
    
    $(window).unload(function () {
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
Cart.prototype.saveCartData = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.cartData);
    }
}

// adds an item to the cart
Cart.prototype.addItemToCart = function (id, name, price) {
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

// get the total price for all items currently in the cart
Cart.prototype.totalPrice = function () {
    var total = 0;
    for (var i = 0; i < this.cartData.length; i++) {
        total += (this.cartData[i].price * this.cartData[i].count);
    }
    return total;
}

Cart.prototype.itemCount = function () {
    var total = 0;
    for (var i = 0; i < this.cartData.length; i++) {
        total += this.cartData[i].count;
    }
    return total;
}

// clear the cart
Cart.prototype.clearCart = function () {
    this.cartData = [];
    this.saveCartData();    // save to local storage
}

// define checkout parameters
Cart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "Google") {
        throw "serviceName must be 'PayPal' or 'Google'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
}

// check out
Cart.prototype.checkOut = function (serviceName, clearCart) {

    // select serviceName if we have to
    if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
}

// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
Cart.prototype.checkoutPayPal = function (parms, clearCart) {

    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };

    // item data
    for (var i = 0; i < this.cartData.length; i++) {
        var item = this.cartData[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.id;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        //data["amount_" + ctr] = item.price.toFixed(2);
        data["amount_" + ctr] = item.price;
    }

    // build form
    var form = $('<form/></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
Cart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.cartData.length; i++) {
        var item = this.cartData[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.id;
        data["item_description_" + ctr] = item.name;
        //data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_price_" + ctr] = item.price;
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}
Cart.prototype.checkoutStripe = function (parms, clearCart) {
    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data["item_name_" + ctr] = item.sku;
    data["item_description_" + ctr] = item.name;
    data["item_price_" + ctr] = item.price.toFixed(2);
    data["item_quantity_" + ctr] = item.quantity;
    }

    // build form
    var form = $('.form-stripe');
    form.empty();
    // NOTE: in production projects, you have to handle the post
    // with a few simple calls to the Stripe API.
    // See https://stripe.com/docs/checkout
    // You'll get a POST to the address below w/ a stripeToken.
    // First, you have to initialize the Stripe API w/ your public/private keys.
    // You then call Customer.create() w/ the stripeToken and your email address.
    // Then you call Charge.create() w/ the customer ID from the
    // previous call and your charge amount.
    form.attr("action", parms.options['chargeurl']);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // ajaxify form
    form.ajaxForm({
    success: function () {
    $.unblockUI();
    alert('Thanks for your order!');
    },
    error: function (result) {
    $.unblockUI();
    alert('Error submitting order: ' + result.statusText);
    }
    });

    var token = function (res) {
    var $input = $('<input type=hidden name=stripeToken />').val(res.id);

    // show processing message and block UI until form is submitted and returns
    $.blockUI({ message: 'Processing order...' });

    // submit form
    form.append($input).submit();
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    };

    StripeCheckout.open({
    key: parms.merchantID,
    address: false,
    amount: this.getTotalPrice() *100, /** expects an integer **/
    currency: 'usd',
    name: 'Purchase',
    description: 'Description',
    panelLabel: 'Checkout',
    token: token
    });
}
// utility methods
Cart.prototype.addFormFields = function (form, data) {
    if (data != null) {
         angular.forEach(data, function (name, value) {
            if (value != null) {
                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                form.append(input);
            }
        });
    }
}
Cart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}
