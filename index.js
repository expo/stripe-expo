"use strict";

var stripe_url = 'https://api.stripe.com/v1/';

module.exports = function(key) {
  return {
    createToken: async function (details) {
      if (details.card != null || details.bank_account != null || details.pii != null) {
        details = _convertDetails(details);
      }
      var token = await _createTokenHelper(details, key);
      return _parseJSON(token);
    }
  }
}

function _convertDetails(details) {
  if (details.card != null) {
    var type = 'card';
    var database = Object.entries(details.card);
  } else if (details.bank_account != null) {
    var type = 'bank_account';
    var database = Object.entries(details.bank_account);
  } else {
    var type = 'pii';
    var database = Object.entries(details.pii);
  }
  var convertedDetails = {}
  for (var data in database) {
    var string = type + '[' + database[data][0] + ']';
    convertedDetails[string] = database[data][1];
  }
  return convertedDetails;
}

function _parseJSON(token) {
  try {
    let body = JSON.parse('' + token._bodyInit);
    return body;
  } catch (err) {
    return err;
  }
}

function _makeBody(details) {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function _createTokenHelper(details, key) {
  var formBody = _makeBody(details);

  return fetch(stripe_url + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
}
