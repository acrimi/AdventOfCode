var parser = require('../parser.js');
var crypto = require('crypto');

// var input = parser.parse(__dirname + '/input', '-');
// var input = require(__dirname + '/input.json');
var input = "wtnhxymk";

var result = "--------";

var index = 0;

while (result.indexOf('-') >= 0) {
  var hash = crypto.createHash('md5');
  var seed = input + (index++);
  hash.update(seed);
  var hex = hash.digest('hex');
  if (hex.match(/^0{5,}/)) {
    var position = parseInt(hex.charAt(5));
    if (!isNaN(position) && position < result.length && result.charAt(position) == '-') {
      result = result.substring(0, position) + hex.charAt(6) + result.substring(position+1);
    }
  }
}


console.log(result);
