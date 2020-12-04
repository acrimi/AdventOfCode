module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const terrain = input.map(row => row.split(''));
  const slopes = [{ x: 3, y: 1 }];
  if (isPart2) {
    slopes.push(
      { x: 1, y: 1 },
      { x: 5, y: 1 },
      { x: 7, y: 1 },
      { x: 1, y: 2 },
    );
  }

  result = slopes.map(slope => {
    const position = { x: 0, y: 0 };
    let trees = 0;
    while (position.y < terrain.length) {
      if (terrain[position.y][position.x] == '#') {
        trees++;
      }
      position.x = (position.x + slope.x) % terrain[position.y].length;
      position.y += slope.y;
    }
    return trees;
  }).reduce((acc, val) => acc * val, 1);

  return result;
}