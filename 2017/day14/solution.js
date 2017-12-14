const knotHash = require('../day10/solution.js');

module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let rowCount = 128;
  let rows = [];
  for (let i = 0; i < rowCount; i++) {
    let key = input + '-' + i;
    let hash = knotHash(key, true);

    let bits = '';
    for (let c of hash) {
      bits += ('000' + parseInt(c, 16).toString(2)).slice(-4);
    }

    rows.push(bits.split(''));

    if (!isPart2) {
      for (let bit of bits) {
        if (bit === '1') {
          result++;
        }
      }
    }
  }

  if (isPart2) {
    let visitedCells = {};
    const visitGroup = (x, y) => {
      visitedCells[x+','+y] = true;
      let adjacents = [
        [x, y+1],
        [x, y-1],
        [x+1, y],
        [x-1, y]
      ];

      for (let adjacent of adjacents) {
        let [x, y] = adjacent;
        if (!visitedCells[x+','+y] && rows[y] && rows[y][x] === '1') {
          visitGroup(x, y);
        }
      }
    };

    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        if (!visitedCells[x+','+y] && rows[y][x] === '1') {
          result++;
          visitGroup(x, y);
        }
      }
    }
  }

  return result;
}