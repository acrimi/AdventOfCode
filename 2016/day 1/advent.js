var parser = require('../parser.js');

var input = parser.parse(__dirname + '/input', ', ')[0];
// var input = require(__dirname + '/input.json');

var result = 0;

var NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3;

var orientation = NORTH;

var visited = {
  0: {
    0: 1
  }
};

var x = 0, y = 0;

for (var i = 0; i < input.length; i++) {
  var dir = input[i];
  if (dir.charAt(0) === 'R') {
    orientation++;
  } else {
    orientation--;
  }

  while (orientation < 0) {
    orientation += 4;
  }

  orientation %= 4;
  var stop = false;

  var steps = parseInt(dir.substring(1));
  if (orientation == NORTH || orientation == SOUTH) {
    var dest = y + (orientation == NORTH ? steps : -steps);

    while (y != dest) {
      y += (orientation == NORTH ? 1 : -1)

      // Part 2
      visited[x] = visited[x] || {};
      visited[x][y] = (visited[x][y] || 0) + 1;
      if (visited[x][y] > 1) {
        stop = true;
        break;
      }
    }
  } else if (orientation == EAST || orientation == WEST) {
    var dest = x + (orientation == EAST ? steps : -steps);

    while (x != dest) {
      x += (orientation == EAST ? 1 : -1);

      // Part 2
      visited[x] = visited[x] || {};
      visited[x][y] = (visited[x][y] || 0) + 1;
      if (visited[x][y] > 1) {
        stop = true;
        break;
      }
    }
  }

  if (stop) {
    break;
  }
}

result = Math.abs(x) + Math.abs(y);

console.log(x+ " "+y);
console.log(result);
