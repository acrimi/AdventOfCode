var parser = require('../parser.js');

var input = parser.parse(__dirname + '/input');
// var input = require(__dirname + '/input.json');

var result = '';

var counts = {};

for (var i = 0; i < input.length; i++) {
  var line = input[i];

  for (var j = 0; j < line.length; j++) {
    var c = line.charAt(j);
    counts[j] = counts[j] || {};
    counts[j][c] = (counts[j][c] || 0) + 1;
  }
}

for (var key in counts) {
  var winningChar;
  var winningCount = 0; // Part 1
  // var winningCount = Number.MAX_VALUE; // Part 2

  for (var c in counts[key]){
    if (counts[key][c] > winningCount) { // Part 1
    // if (counts[key][c] < winningCount) { // Part 2
      winningChar = c;
      winningCount = counts[key][c];
    }
  }

  result += winningChar;
}


console.log(result);
