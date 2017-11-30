var fs = require('fs');

exports.parse = function(input, columnDelimiter, lineCleanUp, columnCleanUp) {
  var input = fs.readFileSync(input, 'utf8');

  var lines = input.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (typeof lineCleanUp === 'function') {
      line = lineCleanUp(line);
    } else if (lineCleanUp !== 'false') {
      line = line.trim().replace(/\s+/g, ' ');
    }

    if (columnDelimiter) {
      line = line.split(columnDelimiter);
      if (typeof columnCleanUp === 'function') {
        for (var j = 0; j < line.length; j++) {
          line[j] = columnCleanUp(line[j]);
        }
      }
    }

    lines[i] = line;
  }

  return lines;
} 