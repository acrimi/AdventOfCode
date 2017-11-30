const fs = require('fs');

exports.parse = (input, columnDelimiter, lineCleanUp, columnCleanUp) => {
  input = fs.readFileSync(input, 'utf8');

  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (typeof lineCleanUp === 'function') {
      line = lineCleanUp(line);
    } else if (lineCleanUp !== 'false') {
      line = line.trim().replace(/\s+/g, ' ');
    }

    if (columnDelimiter) {
      line = line.split(columnDelimiter);
      if (typeof columnCleanUp === 'function') {
        for (let j = 0; j < line.length; j++) {
          line[j] = columnCleanUp(line[j]);
        }
      }
    }

    lines[i] = line;
  }

  return lines;
} 