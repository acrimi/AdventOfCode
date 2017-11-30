var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;


  var ranges = [];

  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    var minMax = line.split('-');
    var min = parseInt(minMax[0]);
    var max = parseInt(minMax[1]);
    var newRange = {
      min: min,
      max: max
    };

    ranges.push(newRange);
  }

  ranges.sort(function(a, b) {
    return a.min - b.min;
  });

  var count = 0;
  for (var i = 1; i < ranges.length; i++) {
    var low = ranges[i-1];
    var high = ranges[i];
    if (high.min < low.max) {
      high.min = Math.min(high.min, low.min);
      high.max = Math.max(high.max, low.max);
      ranges.splice(i-1, 1);
      i--;
    } else {
      count += high.min-1 - low.max;
    }
  }


  result = ranges[0].max + 1;

  // Part 2
  // result = count;  

  return result;
},
[

], 
false, true, false);

