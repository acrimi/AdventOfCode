var runner = require('../runner.js');

runner.run(3014387, function(input, isTest) {
  var result = 0;

  var initialCount = parseInt(input[0]);

  var elfCount = initialCount;
  var divisions = 0;
  var nextMove = 'odd';
  var elf = 1;
  while (elfCount > 1) {
    var isOdd = elfCount % 2 !== 0;
    if (nextMove === 'even') {
      elf += Math.pow(2, divisions);
    }

    if (isOdd) {
      elfCount = (elfCount+ (nextMove === 'odd' ? 1 : -1))/2;
      nextMove = nextMove === 'odd' ? 'even' : 'odd';
    } else {
      elfCount /= 2;
    }
    divisions++;
  }

  result = elf;


  function part1Better(n) {
    var exp = Math.floor(Math.log2(n));
    var power = Math.pow(2, exp);
    return 1 + (n - power)*2;
  }

  function part2(n) {
    var exp = Math.floor(Math.log(n-1) / Math.log(3));
    var power = Math.pow(3, exp);
    return (n-power) + Math.max(0, (n-2*power));
  }


  // Part 1 Simplified
  // result = part1Better(initialCount);

  // Part 2
  result = part2(initialCount);

  return result;
},
[
5,
7,
8,
9,
11,
17,
19,
23
], 
false, true, false);

