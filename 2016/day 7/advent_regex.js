var runner = require('../runner.js');

runner.run(function(input) {
  var result = 0;

  for (var i = 0; i < input.length; i++) {
    var line = input[i];

    if (line.match(/(\w)(?!\1)(\w)\2\1/) && !line.match(/\[[^\]]*?(\w)(?!\1)(\w)\2\1/)) { // Part 1
    // if (line.match(/(?:(?:^|\])[^\[]*?(\w)(?!\1)(\w)\1.*?\[[^\]]*?\2\1\2)|(?:\[[^\]]*?(\w)(?!\3)(\w)\3.*\][^\[]*?\4\3\4)/)) { // Part 2
      result++;
    }

    // Part 2 Alt
    // var regex = /((\w)(?!\2)\w\2)[^\]]*(?:\[|$)/g;
    // var match;
    // while (match = regex.exec(line)) {
    //   regex.lastIndex = match.index + 1;
    //   var str = match[1];
    //   var inverse = str.charAt(1) + str.charAt(0) + str.charAt(1);
    //   if (line.match(new RegExp('\\[[^\\]]*?'+inverse, 'g'))) {
    //     result++;
    //     break;
    //   }
    // }
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

