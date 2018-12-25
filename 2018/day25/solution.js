module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const constellations = [];

  for (let row of input) {
    let [_, x, y, z, a] = row.match(/(-?\d+),(-?\d+),(-?\d+),(-?\d+)/);

    let match;
    for (let i = constellations.length - 1; i >= 0; i--) {
      let constellation = constellations[i];
      let canJoin = false;
      for (let point of constellation) {
        let dist = Math.abs(point.x - x) + Math.abs(point.y - y) + Math.abs(point.z - z) +
          Math.abs(point.a - a);
        if (dist <= 3) {
          canJoin = true;
          break;
        }
      }

      if (canJoin) {
        if (match) {
          match.push(...constellation);
          constellations.splice(i, 1);
        } else {
          match = constellation;
          constellation.push({x, y, z, a});
        }
      }
    }

    if (!match) {
      constellations.push([{x, y, z, a}]);
    }
  }

  result = constellations.length;

  return result;
}