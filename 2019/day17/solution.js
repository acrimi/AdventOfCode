const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);
  const grid = [[]];

  const isBelowIntersection = (x, y) => {
    const centerRow = y > 0 ? grid[y - 1] : null;
    return centerRow &&
      centerRow[x] === '#' &&
      (x === 0 || centerRow[x - 1] === '#') &&
      (x === centerRow.length - 1 || centerRow[x + 1] === '#') &&
      (y === 1 || grid[y - 2][x] === '#');
  };

  comp.execute(null, true);
  const outputs = comp.getOutputs();
  let row = grid[0];
  for (let cell of outputs) {
    const char = String.fromCharCode(cell);
    if (char === '\n') {
      row = [];
      grid.push(row);
    } else {
      row.push(char);
      if (char === '#' && isBelowIntersection(row.length - 1, grid.length - 1)) {
        result += (row.length - 1) * (grid.length - 2);
      }
    }
  }

  return result;
}