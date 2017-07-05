var stripe = require('../index.js')('pk_test_YRjUHSZfJza9RsuNDx9s6e5V');
var async = require("jasmine-await");
var it = async.it;
var await = async.await;

describe("card token creation with valid card details", function () {
  var cardDetails = {
    "card[number]": '4242424242424242',
    "card[exp_month]": '02',
    "card[exp_year]": '21',
    "card[cvc]": '999',
    "card[name]": 'Steve Jobs'
  };

  it ('should create a valid token', () => {
    var token = await(stripe.createToken(cardDetails));
    expect(token.card.object).toBe('card');
  });
});

describe("bank account token creation with valid bank details", function () {
  var bankDetails = {
    bank_account: {
      country: 'US',
      currency: 'usd',
      account_holder_name: 'Noah Martinez',
      account_holder_type: 'individual',
      routing_number: '110000000',
      account_number: '000123456789'
    }
  };


  it ('should create a valid token', () => {
    var token = await(stripe.createToken(bankDetails));
    expect(token.bank_account.object).toBe('bank_account');
  });
});

describe("PII token creation with valid PII details", function () {
  var piiDetails = {
    pii: {
      personal_id_number: '2020202002'
    }
  };


  it ('should create a valid token', () => {
    var token = await(stripe.createToken(piiDetails));
    expect(token.type).toBe('pii');
  });
});

describe("invalid details", function () {
  var invalidCard = {
    "card[number]": '4242424242424242',
    "card[exp_month]": '02',
    "card[exp_yer]": '21',
    "card[cvc]": '999',
    "card[name]": 'Steve Jobs'
  };


  it ('should throw an error', () => {
    var token = await(stripe.createToken(piiDetails));
    expect(token.error.type).toBe('card_error');
  });
});
