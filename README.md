# Stripe

React Native Stripe wrapper that makes using Stripe with React Native easy in iOS/Android.

## Features

- Collect credit card information and convert it to a Stripe token in a single line of Javascript.
- Collect bank account information and convert it to a Stripe token in a single line of Javascript.
- Collect personal identification information and convert it to a Stripe token in a single line of Javascript.

## Limitations

- Stripe only allows an exchange of card information/bank account information/PII in the front end. This does not verify the payment information, it just checks that it looks reasonable (ex. the expiration date is in the future, the credit card number has the right format). You should take this token and immediately pass it to a backend function that validates it (ex. by creating a charge or assigning it to a customer)
- As a corollary, you should only embed your Stripe PUBLISHABLE token in a frontend app.

## Creating a token

`stripe.createToken(...)` returns a Promise of a token object (https://stripe.com/docs/api/node#token_object).

If the token object creation fails (ex. the expiration date is invalid, the card number is the wrong format), `stripe.createToken(...)` returns the corresponding error (https://stripe.com/docs/api/node#errors).

- Example function call
```javascript
stripe.createToken({
  card: {
    "number": '4242424242424242',
    "exp_month": 12,
    "exp_year": 2018,
    "cvc": '123'
  }
});
```
Or
```javascript
var otherValidFormat = {
  "card[number]": '4242424242424242',
  "card[exp_month]": '12',
  "card[exp_year]": '18',
  "card[cvc]": '123'
}
stripe.createToken(otherValidFormat);
```
- Example return:
```javascript
{
  "id": "tok_1AWuxsJd4nFN3COfSKY8195M",
  "object": "token",
  "card": {
    "id": "card_1AWuxsJd4nFN3COfUOhQfBVw",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 8,
    "exp_year": 2018,
    "fingerprint": "EL88ufXeYTG02LOU",
    "funding": "credit",
    "last4": "4242",
    "metadata": {
    },
    "name": null,
    "tokenization_method": null
  },
  "client_ip": null,
  "created": 1497998212,
  "livemode": false,
  "type": "card",
  "used": false
}
```
## Example Usage

### Creating a credit card token
```javascript
import React from 'react';
var stripe = require('stripe')('YOUR_PUBLISHABLE_STRIPE_API_KEY');

var information = {
  card: {
    number: '4242424242424242',
    exp_month: '02',
    exp_year: '21',
    cvc: '999',
    name: 'Billy Joe'
  }
}

export class App extends React.Component {
  async onPayment() {
    var card = await stripe.createToken(information);
    console.log(card.id);
  }

  render() {
    ...
  }
}
```
### Creating a bank account token
```javascript
import React from 'react';
var stripe = require('stripe')('YOUR_PUBLISHABLE_STRIPE_API_KEY');

var information = {
  bank_account: {
    country: 'US',
    currency: 'usd',
    account_holder_name: 'Noah Martinez',
    account_holder_type: 'individual',
    routing_number: '110000000',
    account_number: '000123456789'
  }
}

export class App extends React.Component {
  async onPayment() {
    var card = await stripe.createToken(information);
    console.log(card.id);
  }

  render() {
    ...
  }
}
```
### Creating a PII token
```javascript
var stripe = require('stripe')('YOUR_PUBLISHABLE_STRIPE_API_KEY');

var information = {
  pii: {
    personal_id_number: '000000000'
  }
}

export class App extends React.Component {
  async onPayment() {
    var card = await stripe.createToken(information);
    console.log(card.id);
  }

  render() {
    ...
  }
}
```
## Questions and Answers

Where can I find more information about creating tokens in Stripe?
- Check out the Stripe docs at https://stripe.com/docs/api/node#tokens .

Help! I don't know where to find 'YOUR_PUBLISHABLE_STRIPE_API_KEY' ?
- Make an account on Stripe (if you haven't already) and check out https://dashboard.stripe.com/account/apikeys .

I want to charge a customer with this library. How would I do that?
- Stripe only allows you to exchange card information for a payment token on the frontend. You should get this token, and then immediately pass it to a backend function that validates it, either by creating a charge, or else by attaching it to a customer. See the [Stripe API](https://stripe.com/docs/api) for more information, and [this helpful blog post](http://www.larryullman.com/2013/01/30/handling-stripe-errors/) for more on handling Stripe errors.
