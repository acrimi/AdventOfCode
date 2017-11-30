var runner = require('../runner.js');

runner.run('11100010111110100', function(input, isTest) {
  var result = 0;

  var state = input[0];
  var diskSize = 272;

  // Part 2
  // diskSize = 35651584;

  while (state.length < diskSize) {
    state = processData(state);
  }

  state = state.substring(0, diskSize);
  result = state;

  while (result === state || result.length % 2 === 0) {
    result = getChecksum(result);
  }


  function getChecksum(state) {
    var checksum = '';
    for (var i = 0; i < state.length; i+=2) {
      if (state.charAt(i) === state.charAt(i+1)) {
        checksum += '1';
      } else {
        checksum += '0';
      }
    }

    return checksum;
  }

  function processData(a) {
    var b = a + '';
    b = b.split('').reverse().join('');
    b = b.replace(/0/g, '-').replace(/1/g, '0').replace(/-/g, '1');
    return a + '0' + b;
  }

  return result;
},
[

], 
false, true, false);

