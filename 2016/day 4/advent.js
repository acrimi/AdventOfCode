var parser = require('../parser.js');

var input = parser.parse(__dirname + '/input', '-');
// var input = require(__dirname + '/input.json');

var result = 0;

for (var i = 0; i < input.length; i++) {
  var line = input[i];
  var id = line[line.length - 1];
  var checksum = id.replace(/\d+\[/, '').replace(/\]/, '');
  id = parseInt(id.replace(/\[.+/, ''));

  var letters = "";
  for (var j = 0; j < line.length-1; j++) {
    letters += line[j];
  }

  var invalid = false;

  var missingLetters = letters.replace(new RegExp('['+checksum+']', 'g'), '');

  var highestCount = 0;
  var highestCharCode = 0;
  for (var j = 0; j < missingLetters.length; j++) {
    var count = (letters.match(new RegExp(missingLetters.charAt(j), 'g')) || []).length;
    if (count > highestCount) {
      highestCount = count;
      highestCharCode = missingLetters.charCodeAt(j);
    }
  }

  var lastCount = 0;
  for (var j = 0; j < checksum.length; j++) {
    var count = (letters.match(new RegExp(checksum.charAt(j), 'g')) || []).length;
    if (count < highestCount || (count == highestCount && highestCharCode < checksum.charCodeAt(j))) {
      invalid = true;
      break;
    }
    if (count < lastCount || j == 0 || (lastCount == count && checksum.charCodeAt(j-1) < checksum.charCodeAt(j))) {
      lastCount = count;
    } else {
      invalid = true;
      break;
    }
  }

  if (!invalid) {
    // Part 1
    // result += id;

    // Part 2
    var realName = '';
    var a = ('a').charCodeAt(0);
    for (var j = 0; j < letters.length; j++) {
      if (letters.charAt(j) === '-') {
        realName += ' ';
        continue;
      }
      var code = letters.charCodeAt(j) - a;

      code += id;
      code %= 26;
      realName += String.fromCharCode(code+a);
    }

    if (realName.indexOf('north') >= 0 && realName.indexOf('pole') >= 0) {
      result = id;
      break;
    }
  }

}



console.log(result);
