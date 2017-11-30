var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var lines = input.split('\n');

var result = 0;

var steps = 100;

var grid = [];
for (var i = 0; i < lines.length; i++) {
  grid[i] = [];
}

var buffer;

for (var i = 0; i < lines.length; i++) {
  var line = lines[i].replace(/[^#.]/g, '');
  for (var j = 0; j < line.length; j++) {
    var chr = line[j];
    grid[i][j] = chr == '#';
  }
}

/*
 * Uncomment for Part 2
 */
// grid[0][0] = true;
// grid[0][grid[0].length-1] = true;
// grid[grid.length-1][0] = true;
// grid[grid.length-1][grid[grid.length-1].length-1] = true;

copyToBuffer();

for (var i = 0; i < steps; i++) {
  updateLights();
  copyToBuffer();
}

function updateLights() {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      updateLight(j, i);
    }
  }
}

function updateLight(x, y) {
  /*
   * Uncomment for Part 2
   */
  // if ((x == 0 && y == 0) || (x == 0 && y == buffer.length-1) ||
  //   (x == buffer[0].length-1 && y == 0) || (x == buffer[0].length-1 && y == buffer.length-1)) {
  //   return;
  // }
  var off = 0;
  var on = 0;

  for (var i = y-1; i < y+2; i++) {
    for (var j = x-1; j < x+2; j++) {
      if (i == y && j == x) {
        continue;
      }
      if (i < 0 || i >= buffer.length) {
        off++;
      } else if (j < 0 || j >= buffer[i].lenght) {
        off++;
      } else if (buffer[i][j]) {
        on++;
      } else {
        off++;
      }
    }
  }

  if (buffer[y][x]) {
    if (on != 2 && on != 3) {
      grid[y][x] = false;
    }
  } else {
    if (on == 3) {
      grid[y][x] = true;
    }
  }
}

function copyToBuffer() {
  buffer = [];
  for (var i = 0; i < grid.length; i++) {
    buffer[i] = [].concat(grid[i]);
  }
}


for (var i = 0; i < grid.length; i++) {
  for (var j = 0; j < grid[i].length; j++) {
    if (grid[i][j]) {
      result++;
    }
  }
}

console.log(result);