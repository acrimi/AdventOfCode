var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input.json', 'utf8');

var result = 0;

var arrayTest = /(?:\[|,)\s*(-?\d+)\s*(?=]|,)/g;
var objectTest = /:\s*(-?\d+)\s*(?=}|,)/g;

var matches;
while ((matches = arrayTest.exec(input)) != null) {
  var num = parseInt(matches[1]);
  result += num;
}

while ((matches = objectTest.exec(input)) != null) {
  var num = parseInt(matches[1]);
  result += num;
}



console.log(result);