var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var safe = '.';
  var trap = '^';
  var rowCount = 40;

  // Part 2
  // rowCount = 400000;

  var rows = [
    input[0]
  ];

  for (var i = 0; i < rowCount; i++) {
    if (!rows[i]) {
      rows[i] = getRow(rows[i-1]);
    }

    result += rows[i].match(/\./g).length;
  }

  function getRow(prevRow) {
    var row = '';
    for (var i = 0; i < prevRow.length; i++) {
      var left = i-1 < 0 ? safe : prevRow.charAt(i-1);
      var center = prevRow.charAt(i);
      var right = i+1 >= prevRow.length ? safe : prevRow.charAt(i+1);

      if ((left === trap && center === trap && right === safe) ||
        (center == trap && right === trap && left === safe ) ||
        (left === trap && center === safe && right === safe) ||
        (right == trap && center === safe && left === safe)) {
        row += trap;
      } else {
        row += safe;
      }
    }
    return row;
  }

  return result;
},
[

], 
false, true, false);

