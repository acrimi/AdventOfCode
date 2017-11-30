var parser = require('../parser.js');
var crypto = require('crypto');

// var input = parser.parse(__dirname + '/input', '-');
// var input = require(__dirname + '/input.json');
var input = "wtnhxymk";

var result = "";

var index = 0;

while (result.length < 8) {
  var hash = crypto.createHash('md5');
  var seed = input + (index++);
  hash.update(seed);
  var hex = hash.digest('hex');
  if (hex.match(/^0{5,}/)) {
    result += hex.charAt(5);
  }
}


console.log(result);
