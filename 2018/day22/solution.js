module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  let [depth] = input[0].match(/(\d+)/);
  let [_, x, y] = input[1].match(/(-?\d+),(-?\d+)/);

  const rocky = 0;
  const wet = 1;
  const narrow = 2;
  depth = +depth;
  const target = {
    x: +x,
    y: +y
  };

  const geologicalIndexes = [];
  const erosionLevels = [];

  function getGeologicalIndex(x, y) {
    const row = geologicalIndexes[y] = geologicalIndexes[y] || [];
    if (!row[x]) {
      if (x === 0 && y === 0) {
        row[x] = 0;
      } else if (x === target.x && y === target.y) {
        row[x] = 0;
      } else if (y === 0) {
        row[x] = x * 16807;
      } else if (x === 0) {
        row[x] = y * 48271;
      } else {
        row[x] = getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);
      }
    }

    return row[x];
  }

  function getErosionLevel(x, y) {
    const row = erosionLevels[y] = erosionLevels[y] || [];
    if (!row[x]) {
      row[x] = (getGeologicalIndex(x, y) + depth) % 20183;
    }

    return row[x];
  }

  function getTerrainType(x, y) {
    return getErosionLevel(x, y) % 3;
  }

  for (let y = 0; y <= target.y; y++) {
    for (let x = 0; x <= target.x; x++) {
      result += getTerrainType(x, y);
    }
  }

  return result;
}