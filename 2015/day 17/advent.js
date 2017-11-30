var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var result = 0;

var liters = 150;

var containers = [];

var lines = input.split('\n');
for (var i = 0; i < lines.length; i++) {
  var size = parseInt(lines[i]);
  containers.push(size);
}

var combinations = getCombinations(containers, liters);

function getCombinations(sizes, target) {
  var res = [];

  for (var i = 0; i < sizes.length; i++) {
    if (sizes[i] < target) {
      var first = sizes[i];
      var combinations = getCombinations(sizes.slice(i+1), target-first);
      for (var j = 0; j < combinations.length; j++) {
        var comb = [first].concat(combinations[j]);
        res.push(comb);
      }
    } else if (sizes[i] == target) {
      res.push([sizes[i]]);
    }
  }

  return res;
}

result = combinations.length;

/*
 * Uncomment for Part 2
 */
// result = 0;
// var min = containers.length;

// for (var i = 0; i < combinations.length; i++) {
//   var len = combinations[i].length;
//   if (len < min) {
//     min = len;
//   }
// }

// for (var i = 0; i < combinations.length; i++) {
//   var len = combinations[i].length;
//   if (len == min) {
//     result++;
//   }
// }


console.log(result);