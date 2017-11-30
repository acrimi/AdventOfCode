var runner = require('../runner.js');
var fs = require('fs');

runner.run(function(input, isTest) {
  var result = 0;

  var nodes = {};
  var minX = Number.MAX_VALUE;
  var maxX = 0;
  var minY = minX;
  var maxY = 0;

  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    line.replace(/node-x(\d+)-y(\d+)\s+(\d+)\w\s+(\d+)\w\s+(\d+)\w\s+(\d+)/, function (match, x, y, size, used, avail, use) {
      x = parseInt(x);
      y = parseInt(y);
      size = parseInt(size);
      used = parseInt(used);
      avail = parseInt(avail);
      use = parseInt(use);

      nodes[x] = nodes[x] || {};
      nodes[x][y] = {
        size: size,
        used: used,
        avail: avail,
        use: use
      };

      minX = Math.min(x, minX);
      maxX = Math.max(x, maxX);
      minY = Math.min(y, minY);
      maxY = Math.max(y, maxY);
    });
  }

  for (var i = minX; i <= maxX; i++) {
    if (!nodes[i]) {
      continue;
    }
    for (var j = minY; j <= maxY; j++) {
      var node = nodes[i][j];
      if (!node) {
        continue;
      }

      result += getNodePairs(i, j);
    }
  }

  function getNodePairs(x, y) {
    var count = 0;
    var node = nodes[x][y];
    if (node.used === 0) {
      return 0;
    }
    for (var i = minX; i <= maxX; i++) {
      if (!nodes[i]) {
        continue;
      }
      for (var j = minY; j <= maxY; j++) {
        var node2 = nodes[i][j];
        if (!node2) {
          continue;
        }

        if (node2 !== node && node.used <= node2.avail) {
          count++;
        }
      }
    }

    return count;
  }

  part2();

  function part2() {
    if (fs.existsSync('map')) {
      fs.truncateSync('map');
    }
    for (var j = minY; j <= maxY; j++) {
      var line = '';
      for (var i = minX; i <= maxX; i++) {
        var node = nodes[i][j];
        if (node.used === 0) {
          line += ' _ ';
        } else if (node.used > 100) {
          line += ' # ';
        } else if (j == minY && i == minX) {
          line += '(.)';
        } else if (j == minY && i == maxX) {
          line += ' G ';
        } else {
          line += ' . ';
        }
      }
      fs.appendFileSync('map', line+'\n');
    }
  }


  return result;
},
[

],
false, true, false);

