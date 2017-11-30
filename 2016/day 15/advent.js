var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var discs = [];

  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    line.replace(/Disc #\d+ has (\d+).*?time=(\d+).*?position (\d+)/, function(match, positionCount, time, zeroPosition) {
      var disc = {
        positionCount: parseInt(positionCount),
        zeroPosition: parseInt(zeroPosition),
        firstTime: parseInt(positionCount) - parseInt(zeroPosition) - (discs.length + 1) 
      };
      discs.push(disc);
    });
  }

  // Part 2
  // discs.push({
  //   positionCount: 11,
  //   zeroPosition: 0,
  //   firstTime: 11 - (discs.length + 1)
  // });

  var disc = discs[0];
  var time = disc.firstTime;
  while (!result) {
    var fail = false;
    for (var i = 1; i < discs.length; i++) {
      var disc2 = discs[i];
      if ((time - disc2.firstTime) % disc2.positionCount !== 0) {
        time += disc.positionCount;
        fail = true;
        break;
      }
    }

    if (!fail) {
      result = time;
    }
  }

  return result;
},
[
], 
false, true, false);

