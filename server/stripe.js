// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
var stripeToken = request.body.stripeToken;

var charge = stripe.charges.create({
  amount: 1000, // amount in cents, again
  currency: "usd",
  source: stripeToken,
  description: "Example charge",
  metadata: {'order_id: '6735'}
}, function(err, charge) {
  if (err && err.type === 'StripeCardError') {
    // The card has been declined
  }
});

stripe.customers.create({
  source: stripeToken,
  description: 'payinguser@example.com'
}).then(function(customer) {
  return stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "usd",
    customer: customer.id
  });
}).then(function(charge) {
  // YOUR CODE: Save the customer ID and other info in a database for later!
});

// YOUR CODE: When it's time to charge the customer again, retrieve the customer ID!

stripe.charges.create({
  amount: 1500, // amount in cents, again
  currency: "usd",
  customer: customerId // Previously stored, then retrieved
});