var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var lines = input.replace(/\r/g, '').split('\n');

var result = 0;
var weights = [];
var target = 0;

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var parts = line.split(' ');
  weights.push(parseInt(line));
  target += parseInt(line);
}

target /= 3;

/*
 * Uncomment for Part 2
 */
// target /= 4;

var combinations = getCombinations(weights, 0);

var count = -1;
var qe = -1;

for (var i = 0; i < combinations.length; i++) {
  var cmb = combinations[i];
  var cnt = cmb.length;
  var weight = 0;
  var entanglement = 1;

  if (count < 0 || cnt <= count) {
    for (var j = 0; j < cmb.length; j++) {
      var w = cmb[j];
      weight += w;
      entanglement *= w;
    }

    if (weight == target) {
      if (cnt == count) {
        if (entanglement < qe) {
          qe = entanglement;
        }
      } else {
        count = cnt;
        qe = entanglement;
      }
    }
  }
}

result = qe;

console.log(result);

function getCombinations(list, current) {
  var res = [];

  for (var i = 0; i < list.length; i++) {
    var first = list[i];
    if (first + current > target) {
      continue;
    } else if (first + current == target) {
      res.push([first]);
      continue;
    }
    var combinations = getCombinations(list.slice(i+1), first + current);
    for (var j = 0; j < combinations.length; j++) {
      var comb = [first].concat(combinations[j]);
      res.push(comb);
    }
  }

  return res;
}