module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const rows = 128;
  const columns = 8;
  const seats = [];
  const ids = {};

  function getPosition(commands, max) {
    let pos = 0;
    let size = max;
    for (const cmd of commands) {
      if (cmd == 'B' || cmd == 'R') {
        pos += size/2;
      }
      size /= 2;
    }
    return pos;
  }

  for (const pass of [].concat(input)) {
    const row = getPosition(pass.substring(0, 7), rows);
    const column = getPosition(pass.substring(7), columns);
    const id = row * 8 + column;
    if (isPart2) {
      seats[row] = seats[row] || [];
      seats[row][column] = id;
      ids[id] = true;
    } else {
      result = Math.max(result, id);
    }
  }

  if (isPart2) {
    loop:
    for (let r = 0; r < seats.length; r++) {
      const row = seats[r];
      if (!row) {
        continue;
      }
      for (let c = 0; c < columns; c++) {
        const id = r * 8 + c;
        if (row[c] == null && ids[id - 1] && ids[id + 1]) {
          result = id;
          break loop;
        }
      }
    }
  }

  return result;
}