module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const maxSafeDistance = isTest ? 32 : 10000;
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  let coordinates = {};
  let edges = [];
  let safeCellCount = 0;

  const distance = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  let i = 0;
  for (let position of input) {
    let [_, x, y] = position.match(/(\d+), (\d+)/);
    x = +x;
    y = +y;

    coordinates[position] = {
      key: position,
      x: x,
      y: y,
      count: 0
    };

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      let totalDistance = 0;

      let minDist = -1;
      let nearest = null;
      let shared = false;
      for (let key in coordinates) {
        let position = coordinates[key];
        let dist = distance(x, y, position.x, position.y);
        totalDistance += dist;
        if (minDist === -1 || dist < minDist) {
          shared = false;
          nearest = position;
          minDist = dist;
        } else if (dist === minDist) {
          shared = true;
        }
      }

      if (totalDistance < maxSafeDistance) {
        safeCellCount++;
      }

      if (!shared && nearest) {
        coordinates[nearest.key].count++;

        if (x === minX || x === maxX || y === minY || y === maxY) {
          edges.push(nearest.key);
        }
      }
    }
  }

  if (!isPart2) {
    let maxArea = 0;
    for (let key in coordinates) {
      if (!edges.includes(key)) {
        let position = coordinates[key];
        if (position.count > maxArea) {
          maxArea = position.count;
        }
      }
    }
    result = maxArea;
  } else {
    result = safeCellCount;
  }

  return result;
}