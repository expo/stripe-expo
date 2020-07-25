const STRIPE_URL = 'https://api.stripe.com/v1/';
const FORMURLENCODED = require('form-urlencoded');

module.exports = function(key) {
  return {
    createToken: async function (details) {
      const keys = Object.keys(details);
      const index = _findType(details, keys);
      var token;
      if (index == 0) {
        let type = keys[index];
        var newDetails = _convertDetails(type, details[type]);
        token = await _createTokenHelper(newDetails, key);
      } else {
        token = await _createTokenHelper(details, key);
      }
      return _parseJSON(token);
    }
  }
}

// Stripe normally only allows for fetch format for the details provided.
// _findType allows the user to use the node format of the details by
// figuring out which format/type the details provided are.
function _findType(details, keys) {
  if (details.card != null) {
    return keys.indexOf("card");
  } else if (details.bank_account != null) {
    return keys.indexOf("bank_account");
  } else if (details.pii != null) {
    return keys.indexOf("pii");
  } else if (details.account != null) {
    return keys.indexOf("account");
  } else return false;
}

// _convertDetails converts and returns the data in the given details
// to the correct Stripe format for the given type.
function _convertDetails(type, details) {
  var convertedDetails = {}
  for (var data in details) {
    const string = type + '[' + data + ']';
    convertedDetails[string] = details[data];
  }
  return convertedDetails;
}

// Stripe gives a JSON object with the token object embedded as a JSON string.
// _parseJSON finds that string in and returns it as a JSON object, or an error
// if Stripe threw an error instead. If the JSON does not need to be parsed, returns the token.
async function _parseJSON(token) {
  if (token._bodyInit == null) {
    return token;
  } else {
    const body = await token.json();
    return body;
  }
}

function _createTokenHelper(details, key) {
  const formBody = FORMURLENCODED(details);
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
