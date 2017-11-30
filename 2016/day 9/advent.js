var runner = require('../runner.js');

runner.run(function(input) {
  var result = 0;

  result = getDecompressedStringLength(input[0]);

  function getDecompressedStringLength(str) {
    var res = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      if (ch == '(') {
        var x = str.indexOf('x', i);
        var close = str.indexOf(')', x);
        var len = parseInt(str.substring(i+1, x));
        var reps = parseInt(str.substring(x+1, close));
        var targetLen = len;  // Part 1
        // var targetLen = getDecompressedStringLength(str.substr(close+1, len));  // Part 2
        res += targetLen * reps;

        i = close + len;
      } else {
        res++;
      }
    }

    return res;
  }

  return result;

},
[
'ADVENT',
'A(1x5)BC',
'(3x3)XYZ',
'A(2x2)BCD(2x2)EFG',
'(6x1)(1x3)A',
'X(8x2)(3x3)ABCY'
], 
false, true, false);

