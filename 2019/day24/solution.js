module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const bug = '#';
  const empty = '.';
  const previousStates = {};
  previousStates[input.join('')] = true;
  let lastState = input;
  while (true) {
    const newState = [];
    for (let y = 0; y < lastState.length; y++) {
      const row = lastState[y];
      let newRow = '';
      for (let x = 0; x < row.length; x++) {
        let adjacentBugs = 0;
        for (let dy = -1; dy <= 1 && y + dy < lastState.length; dy += 2) {
          if (y + dy < 0) {
            continue;
          }
          if (lastState[y + dy][x] === bug) {
            adjacentBugs++;
          }
        }
        for (let dx = -1; dx <= 1 && x + dx < row.length; dx += 2) {
          if (x + dx < 0) {
            continue;
          }
          if (row[x + dx] === bug) {
            adjacentBugs++;
          }
        }
        let cell = row[x];
        if (cell === bug && adjacentBugs !== 1) {
          cell = empty;
        } else if (cell === empty && adjacentBugs > 0 && adjacentBugs < 3) {
          cell = bug;
        }
        newRow += cell;
      }
      newState.push(newRow);
    }
    lastState = newState;
    const str = lastState.join('');
    if (previousStates[str]) {
      break;
    }
    previousStates[str] = true;
  }

  let value = 1;
  const str = lastState.join('');
  for (let char of str) {
    if (char === bug) {
      result += value;
    }
    value *= 2;
  }

  return result;
}