module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const planets = [];
  const planetPairs = {};
  const levelCounts = {};

  for (let pair of input) {
    const orbiter = pair[1];
    const center = pair[0];
    planets.push(orbiter);
    planetPairs[orbiter] = center;
  }

  const getLevelCount = planet => {
    if (!planet) {
      return -1;
    }
    if (levelCounts[planet] == null) {
      levelCounts[planet] = getLevelCount(planetPairs[planet]) + 1;
    }
    return levelCounts[planet];
  };

  if (!isPart2) {
    for (let planet of planets) {
      result += getLevelCount(planet);
    }
  } else {
    const start = planetPairs.YOU;
    const end = planetPairs.SAN;
    const path1 = [start];
    const path2 = [end];

    let next1 = start;
    let next2 = end;
    let commonAncestor;
    while (true) {
      if (next1) {
        next1 = planetPairs[next1];
        if (path2.includes(next1)) {
          commonAncestor = next1;
          break;
        }
        if (next1) {
          path1.push(next1);
        }
      }
      if (next2) {
        next2 = planetPairs[next2];
        if (path1.includes(next2)) {
          commonAncestor = next2;
          break;
        }
        if (next2) {
          path2.push(next2);
        }
      }
    }

    if (commonAncestor) {
      const ancestorDist = getLevelCount(commonAncestor);
      result = getLevelCount(start) - ancestorDist + getLevelCount(end) - ancestorDist;
    }
  }

  return result;
}