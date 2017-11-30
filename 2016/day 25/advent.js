var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var val = 0;
  while (result === 0) {
    var signal = attemptWith(val);
    if (signal.match(/^(?:01)+0?$/)) {
      result = val;
      break;
    }
    val++;
  }

  function attemptWith(value) {
    var output = '';

    var registers = {
      a: value
    };

    for (var i = 0; i < input.length; i++) {
      if (output.length > 10) {
        return output;
      }
      var line = input[i];
      
      line.replace(/(cpy|jnz|inc|dec|out) (-?\w+) ?(-?\w+)?/, function(match, op, a, b) {
        switch (op) {
          case 'cpy':
            if (/[a-z]/.test(b)) {
              var val;
              if (/\d/.test(a)) {
                val = parseInt(a);
              } else {
                val = registers[a] || 0;
              }
              registers[b] = val;
            }
            break;
          case 'dec':
            if (/[a-z]/.test(a)) {
              registers[a] = (registers[a] || 0) - 1;
            }
            break;
          case 'inc':
            if (/[a-z]/.test(a)) {
              registers[a] = (registers[a] || 0) + 1;
            }
            break;
          case 'jnz':
            var val;
            if (/\d/.test(a)) {
              val = parseInt(a);
            } else {
              val = registers[a] || 0;
            }

            var skip;
            if (/\d/.test(b)) {
              skip = parseInt(b);
            } else {
              skip = registers[b] || 0;
            }

            if (val) {
              i += skip - 1;
            }
            break;
          case 'out':
            var val;
            if (/\d/.test(a)) {
              val = a;
            } else {
              val = registers[a] || '0';
            }
            output += val;
            break;
        }
      });
    }
  }

  return result;
},
[

],
false, true, false);

