var parser = require('../parser.js');

var input = parser.parse(__dirname + '/input', ' ', true, parseInt);
// var input = require(__dirname + '/input.json');

var result = 0;

// Part 1
// for (var i = 0; i < input.length; i++) {
//   var sides = input[i];

//   if (isValid(sides[0], sides[1], sides[2])) {
//     result++;
//   }
// }

// Part 2
for (var i = 0; i < input.length; i += 3) {
  var row1 = input[i];
  var row2 = input[i+1];
  var row3 = input[i+2];

  for (var j = 0; j < 3; j++) {
    if (isValid(row1[j], row2[j], row3[j])) {
      result++;
    }
  }
}

function isValid(side1, side2, side3) {
  return (side1 + side2 > side3) &&
    (side1 + side3 > side2) &&
    (side2 + side3 > side1);
}


console.log(result);
