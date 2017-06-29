const STRIPE_URL = 'https://api.stripe.com/v1/';
var formurlencoded = require('form-urlencoded');

module.exports = function(key) {
  return {
    createToken: async function (details) {
      let keys = Object.keys(details);
      let index = _findType(details, keys);
      if (index) {
        let type = keys[index];
        details = _convertDetails(type, details[type]);
      }
      let token = await _createTokenHelper(details, key);
      return _parseJSON(token);
    }
  }
}

function _findType(details, keys) {
  if (details.card != null) {
    return keys.indexOf("card");
  } else if (details.bank_account != null) {
    return keys.indexOf("bank_account");
  } else if (details.pii != null) {
    return keys.indexOf("pii");
  } else return false;
}

function _convertDetails(type, details) {
  var convertedDetails = {}
  for (var data in details) {
    var string = type + '[' + data + ']';
    convertedDetails[string] = details[data];
  }
  return convertedDetails;
}

// Stripe gives a JSON object with the token object embedded as a JSON string.
// _parseJSON finds that string in and returns it as a JSON object, or an error
// if Stripe threw an error instead.
function _parseJSON(token) {
  try {
    let body = JSON.parse('' + token._bodyInit);
    return body;
  } catch (err) {
    throw err;
  }
}

function _createTokenHelper(details, key) {
  var formBody = formurlencoded(details);
  return fetch(STRIPE_URL + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
}
