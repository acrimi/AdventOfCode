var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var registers = {
    // c: 1  // part 2
  };
  
  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    line.replace(/(cpy|jnz|inc|dec) (\w+) ?(-?\w+)?/, function(match, op, a, b) {
      switch (op) {
        case 'cpy':
          var val;
          if (/\d/.test(a)) {
            val = parseInt(a);
          } else {
            val = registers[a] || 0;
          }
          registers[b] = val;
          break;
        case 'dec':
          registers[a] = (registers[a] || 0) - 1;
          break;
        case 'inc':
          registers[a] = (registers[a] || 0) + 1;
          break;
        case 'jnz':
          var val;
          if (/\d/.test(a)) {
            val = parseInt(a);
          } else {
            val = registers[a] || 0;
          }
          if (val) {
            i += parseInt(b) - 1;
          }
          break;
      }
    });
  }

  result = registers.a;

  return result;
},
1, 
false, true, false);

