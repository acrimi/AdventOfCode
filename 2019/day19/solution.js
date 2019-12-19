const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);

  if (!isPart2) {
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        result += comp.execute([x, y], true).value.pop();
        comp.reset(input);
      }
    }
  } else {
    const grid = [];
    let minX = 0;
    let maxX = Number.MAX_SAFE_INTEGER;
    for (let y = 0; y < Number.MAX_SAFE_INTEGER; y++) {
      let foundCell = false;
      for (let x = minX; x <= maxX; x++) {
        if (comp.execute([x, y], true).value.pop() === 1) {
          grid[y] = grid[y] || [];
          grid[y][x] = true;
          if (!foundCell) {
            minX = x;
            maxX = Number.MAX_SAFE_INTEGER;
          } else if (x === minX + 99 && grid[y - 99] && grid[y - 99][x]) {
            return minX * 10000 + y - 99;
          }
          foundCell = true;
        } else if (foundCell) {
          maxX = x + 10; // random padding, nearly horizontal beams might not overlap between rows
          comp.reset(input);
          break;
        }
        comp.reset(input);
      }
    }
  }

  return result;
}