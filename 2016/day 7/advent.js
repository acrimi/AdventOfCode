var runner = require('../runner.js');

runner.run(function(input) {
  var result = 0;

  for (var i = 0; i < input.length; i++) {
    var line = input[i];

    var success = false;
    var sequence = '';
    var inBrackets = false;
    for (var j = 0; j < line.length; j++) {
      var ch = line.charAt(j);
      if (ch === '[') {
        inBrackets = true;
        sequence = '';
      } else if (ch === ']') {
        inBrackets = false;
        sequence = '';

      // Part 1
      } else {
        sequence += ch;
        if (sequence.length === 4) {
          if (sequence.charAt(0) === sequence.charAt(3) && sequence.charAt(0) !== sequence.charAt(1) &&
            sequence.charAt(1) === sequence.charAt(2)) {
            if (inBrackets) {
              success = false;
              break;
            } else {
              success = true;
            }
          }
          sequence = sequence.substring(1);
        }
      }

        // Part 2
      // } else if (!inBrackets) {
      //   sequence += ch;
      //   if (sequence.length === 3) {
      //     if (sequence.charAt(0) === sequence.charAt(2) && sequence.charAt(0) !== sequence.charAt(1)) {
      //       var inverse = sequence.charAt(1) + sequence.charAt(0) + sequence.charAt(1);
      //       var regex = new RegExp('\\[[^\\]]*?' + inverse, 'g');
      //       if (line.match(regex)) {
      //         success = true;
      //         break;
      //       }
      //     }
      //     sequence = sequence.substring(1);
      //   }
      // }
    }

    if (success) {
      result++;
    }
  }


  return result;

}, 
[
"abba[mnop]qrst",  // Part 1
"abcd[bddb]xyyx",
"aaaa[qwer]tyui",
"ioxxoj[asdfgh]zxcvbn"
// "aba[bab]xyz",  // Part 2
// "xyx[xyx]xyx",
// "aaa[kek]eke",
// "zazbz[bzb]cdb"
], 
false, true, false);

