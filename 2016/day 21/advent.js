var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var part2 = false;

  var password = 'abcdefgh';
  if (isTest) {
    password = 'abcde';
  }

  if (part2 && !isTest) {
    password = 'fbgdceah';

    for (var i = input.length-1; i >= 0; i--) {
      processCommand(input[i]);
    }
  } else {
    for (var i = 0; i < input.length; i++) {
      processCommand(input[i]);
    }
  }

  function processCommand(line) {    
    line.replace(/swap position (\d+) with position (\d+)/, function(match, x, y) {
      x = parseInt(x);
      y = parseInt(y);
      var min = Math.min(x, y);
      var max = Math.max(x, y);
      var a = password.charAt(min);
      var b = password.charAt(max);

      password = password.substring(0, min) + b + password.substring(min+1, max) +
        a + password.substring(max+1);
    });

    line.replace(/swap letter (\w) with letter (\w)/, function(match, a, b) {
      password = password.replace(new RegExp(a+'|'+b, 'g'), function(match) {
        if (match === a) {
          return b;
        } else {
          return a;
        }
      });
    });

    line.replace(/rotate (left|right) (\d+) step/, function(match, direction, steps) {
      steps = parseInt(steps);
      rotate(direction, steps);
    });

    line.replace(/rotate based on position of letter (\w)/, function(match, letter) {
      if (!part2) {
        var index = password.indexOf(letter);

        rotate('right', 1 + index + (index >= 4 ? 1 : 0));
      } else {
        var rotations = 0;
        var index = password.indexOf(letter);
        do {
          rotate('right', 1);
          rotations++;
          index = password.indexOf(letter);
        } while (index !== (rotations - 1 - (index >= 4 ? 1 : 0)))
      }
    });

    line.replace(/reverse positions (\d+) through (\d+)/, function(match, x, y) {
      x = parseInt(x);
      y = parseInt(y);
      var arr = password.split('');
      arr = arr.slice(0, x).concat(arr.slice(x, y+1).reverse()).concat(arr.slice(y+1));
      password = arr.join('');
    });

    line.replace(/move position (\d+) to position (\d+)/, function(match, x, y) {
      x = parseInt(x);
      y = parseInt(y);

      if (part2) {
        x1 = y;
        y = x;
        x = x1;
      }

      if (x < y) {
        password = password.substring(0, x) + password.substring(x+1, y+1) + password.charAt(x) + password.substring(y+1);
      } else {
        password = password.substring(0, y) + password.charAt(x) + password.substring(y, x) + password.substring(x+1);
      }
    });
  }

  function rotate(direction, steps) {
    steps %= password.length;
    if ((direction === 'left' && !part2) || (direction === 'right' && part2)) {
      password = password.substring(steps) + password.substring(0, steps);
    } else {
      password = password.substring(password.length - steps) + password.substring(0, password.length - steps);
    }
  }

  result = password;

  return result;
},
1, 
false, true, false);

