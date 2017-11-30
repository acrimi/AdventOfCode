var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var registers = {
  };

  if (!isTest) {
    registers.a = 7;
    // Part 2
    // registers.a = 12;
  }

  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    
    line.replace(/(cpy|jnz|inc|dec|tgl|spc) (-?\w+) ?(-?\w+)?/, function(match, op, a, b) {
      switch (op) {
        case 'spc':
          registers.a += registers.b * registers.d;
          break;
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
        case 'tgl':
          var val;
          if (/\d/.test(a)) {
            val = parseInt(a);
          } else {
            val = registers[a] || 0;
          }
          toggleLine(i+val);
          break;
      }
    });
  }

  function toggleLine(index) {
    if (index < 0 || index >= input.length) {
      return;
    }
    var line = input[index];
    line.replace(/(cpy|jnz|inc|dec|tgl|spc) (-?\w+) ?(-?\w+)?/, function(match, op, a, b) {
      switch (op) {
        case 'cpy':
          line = 'jnz '+a+' '+b;
          break;
        case 'dec':
          line = 'inc '+a;
          break;
        case 'inc':
        case 'spc':
          line = 'dec '+a;
          break;
        case 'jnz':
          line = 'cpy '+a+' '+b;
          break;
        case 'tgl':
          line = 'inc '+a;
          break;
      }
    });
    input[index] = line;
  }

  result = registers.a;

  return result;
},
1,
false, true, false);

