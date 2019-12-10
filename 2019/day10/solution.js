module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const empty = '.';
  const asteroid = '#';
  const counts = [];

  const getAsteroidCell = (x, y) => {
    if (!counts[y]) {
      counts[y] = [];
    }
    if (!counts[y][x]) {
      counts[y][x] = {
        slopes: [],
        asteroids: []
      };
    }
    return counts[y][x];
  }

  const hasLineOfSight = (x1, y1, x2, y2) => {
    const slope = (y1 - y2) / (x1 - x2);
    const cell = getAsteroidCell(x1, y1);
    if (cell.slopes.includes(slope)) {
      return false;
    }
    cell.slopes.push(slope);
    return true;
  };

  const countAsteroids = (x, y) => {
    const cell = getAsteroidCell(x, y);
    for (let y2 = y; y2 < input.length; y2++) {
      const row = input[y2];
      const start = y2 == y ? x + 1 : 0;
      for (let x2 = start; x2 < row.length; x2++) {
        if (row[x2] !== asteroid) {
          continue;
        }
        const cell2 = getAsteroidCell(x2, y2);
        if (hasLineOfSight(x, y, x2, y2)) {
          cell.asteroids.push({x: x2, y: y2});
          cell2.asteroids.push({x, y});
        }
      }
    }

    return cell.asteroids.length;
  }

  const calculateCounts = () => {
    const station = {
      count: 0
    };
    for (let y = 0; y < input.length; y++) {
      const row = input[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== asteroid) {
          continue;
        }
        const count = countAsteroids(x, y);
        if (count > station.count) {
          station.count = count;
          station.x = x;
          station.y = y;
        }
      }
    }
    return station;
  }

  if (!isPart2) {
    result = calculateCounts().count;
  } else {
    const station = calculateCounts();
    const stationCell = getAsteroidCell(station.x, station.y);
    const targetAsteroid = 200;
    let destroyed = 0;

    const getQuadrant = (x, y) => {
      if (x >= 0 && y < 0) {
        return 1;
      } else if (x >= 0 && y >= 0) {
        return 2;
      } else if (x < 0 && y >= 0) {
        return 3;
      } else {
        return 4;
      }
    }


    while (destroyed < targetAsteroid) {
      const asteroids = stationCell.asteroids.sort((a, b) => {
        const dx1 = a.x - station.x;
        const dy1 = a.y - station.y;
        const dx2 = b.x - station.x;
        const dy2 = b.y - station.y;
        const quad1 = getQuadrant(dx1, dy1);
        const quad2 = getQuadrant(dx2, dy2);
        let result = quad1 - quad2;
        if (result === 0) {
          const slope1 = dy1 / dx1;
          const slope2 = dy2 / dx2;
            result = slope1 - slope2;
        }
        return result;
      });
      
      if (asteroids.length + destroyed >= targetAsteroid) {
        const pos = asteroids[targetAsteroid - 1];
        result = pos.x * 100 + pos.y;
      } else {
        for (let asteroid of asteroids) {
          input[asteroid.y][asteroid.x] = empty;
        }
        counts = [];
        calculateCounts();
      }

      destroyed += asteroids.length;
    }
  }

  return result;
}