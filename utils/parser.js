const fs = require('fs');

exports.parse = (input, columnDelimiter, lineCleanup, columnCleanup) => {
  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (typeof lineCleanup === 'function') {
      line = lineCleanup(line);
    } else if (lineCleanup === true) {
      line = line.trim().replace(/\s+/g, ' ');
    }

    if (columnDelimiter) {
      line = line.split(columnDelimiter);
      for (let j = 0; j < line.length; j++) {
        if (typeof columnCleanup === 'function') {
          line[j] = columnCleanup(line[j]);
        } else if (columnCleanup === true) {
          line[j] = line[j].trim();
        }
      }
    }

    lines[i] = line;
  }

  if (lines.length == 1) {
    return lines[0];
  }

  return lines;
} 