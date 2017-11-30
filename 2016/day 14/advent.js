var runner = require('../runner.js');
var crypto = require('crypto');

runner.run('yjdafjpo', function(input, isTest) {
  var result = 0;

  var keys = 0;
  var salt = input[0];
  var index = 0;
  var stretching = 0;
  // Part 2
  // stretching = 2016;

  var hashes = [];

  while (keys < 64) {
    var hash = getHash(index);    

    var match;
    var next;
    if ((match = hash.match(/(\w)\1{2,}/)) && (next = checkFutureHashes(index+1, match[1]))) {
      keys++;
    }

    index++;
  }

  function getHash(index) {
    if (hashes[index]) {
      return hashes[index];
    }
    var hash = salt+index;
    for (var i = 0; i < stretching + 1; i++) {
      var md5 = crypto.createHash('md5');
      md5.update(hash);
      hash = md5.digest('hex');
    }

    hashes[index] = hash;

    return hash;
  }

  function checkFutureHashes(startIndex, character) {
    for (var i = 0; i < 1000; i++, startIndex++) {
      var hash = getHash(startIndex);

      if (new RegExp(character+'{5,}').test(hash)) {
        return hash;
      }
    }

    return false;
  }

  result = index-1;

  return result;
},
[
'abc'
], 
false, true, false);

