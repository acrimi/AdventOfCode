var runner = require('../runner.js');

runner.run(function(input) {
  var result = 0;

  var screen = [];
  for (var i = 0; i < 6; i++) {
    var row = [];
    for (var j = 0; j < 50; j++) {
      row.push(0);
    }
    screen.push(row);
  }
  
  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    var match;
    if (match = line.match(/rect (\d+)x(\d+)/)) {
      var width = parseInt(match[1]);
      var height = parseInt(match[2]);

      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          screen[y][x] = 1;
        }
      }
    } else if (match = line.match(/rotate row y=(\d+) by (\d+)/)) {
      var y = parseInt(match[1]);
      var delta = parseInt(match[2]);

      var row = screen[y];
      var newRow = []

      for (var j = 0; j < row.length; j++) {
        var index = j - delta;
        if (index < 0) {
          index += row.length;
        }

        newRow[j] = row[index];
      }

      screen[y] = newRow;
    } else if (match = line.match(/rotate column x=(\d+) by (\d+)/)) {
      var col = parseInt(match[1]);
      var delta = parseInt(match[2]);

      var tmp = [];

      for (var j = 0; j < screen.length; j++) {
        var index = j - delta;
        if (index < 0) {
          index += screen.length;
        }

        tmp[j] = screen[index][col];
      }

      for (var j = 0; j < tmp.length; j++) {
        screen[j][col] = tmp[j];
      }
    }
  }

  for (var i = 0; i < screen.length; i++) {
    var row = screen[i];
    for (var j = 0; j < row.length; j++) {
      if (row[j]) {
        result++;
      }
    }

    console.log(''+row);
  }

  return result;

},
[

], 
false, true, false);

