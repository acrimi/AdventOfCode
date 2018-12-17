module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const waterEntry = 500;
  let grid = [];
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  for (let row of input) {
    let [_, x] = row.match(/x=([0-9.]+)/);
    let [__, y] = row.match(/y=([0-9.]+)/);
    x = x.split('..');
    y = y.split('..');

    let startX = +x[0];
    let startY = +y[0];
    let endX = x.length === 2 ? +x[1] : startX;
    let endY = y.length === 2 ? +y[1] : startY;
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        grid[j] = grid[j] || {};
        grid[j][i] = '#';
      }
    }

    minX = Math.min(minX, startX);
    maxX = Math.max(maxX, endX);
    minY = Math.min(minY, startY);
    maxY = Math.max(maxY, endY);
  }

  let dropPoints = [{x: waterEntry, y: minY - 1}];
  let minWetX = minX;
  let maxWetX = maxX;

  function expandWaterTo(x, y) {
    minWetX = Math.min(minWetX, x);
    maxWetX = Math.max(maxWetX, x);
    grid[y][x] = '|';
    dropPoints.push({x, y})
    !isPart2 && result++;
  }

  function fillRow(x, y) {
    let left = x - 1;
    let right = x + 1;
    while (left !== -1 || right !== -1) {
      if (left !== -1) {
        if (grid[y][left] === '#') {
          left = -1;
        } else {
          grid[y][left] = '~';
          isPart2 && result++;
          left--;
        }
      }
      if (right !== -1) {
        if (grid[y][right] === '#') {
          right = -1;
        } else {
          grid[y][right] = '~';
          isPart2 && result++;
          right++;
        }
      }
    }
    grid[y][x] = '~';
    isPart2 && result++;
  }

  function goToEdge(x, y) {
    let row = grid[y];
    let nextRow = grid[y + 1];
    let left = x - 1;
    while (row[left] !== '#') {
      if (row[left] !== '|') {
        expandWaterTo(left, y);
        return true;
      } else if (nextRow) {
        if (!nextRow[left]) {
          expandWaterTo(left, y + 1);
          return true;
        } else if (nextRow[left] === '|') {
          return true;
        }
      }
      left--;
    }
    let right = x + 1
    while (row[right] !== '#') {
      if (row[right] !== '|') {
        expandWaterTo(right, y);
        return true;
      } else if (nextRow) {
        if (!nextRow[right]) {
          expandWaterTo(right, y + 1);
          return true;
        } else if (nextRow[right] === '|') {
          return true;
        }
      }
      right++;
    }
    return false;
  }

  function flowFrom(x, y) {
    grid[y] = grid[y] || {};
    let row = grid[y];
    let left = row[x - 1];
    let right = row[x + 1];
    let blocked = true;
    if (left !== '#' && left !== '|') {
      expandWaterTo(x - 1, y);
      blocked = false;
    }
    if (right !== '#' && right !== '|') {
      expandWaterTo(x + 1, y);
      blocked = false;
    }
    if (blocked && !goToEdge(x, y)) {
      fillRow(x, y);
      return true;
    }
  }

  function dropFrom(x, y) {
    y++;
    grid[y] = grid[y] || {};
    if (y <= maxY && grid[y] && grid[y][x] !== '|') {
      if (grid[y][x] === '#' || grid[y][x] === '~') {
        flowFrom(x, y - 1);
        return false;
      } else {
        expandWaterTo(x, y);
        return true;
      }
    }

    return false;
  }

  while (dropPoints.length > 0) {
    let idx = dropPoints.length - 1;
    let dropPoint = dropPoints[idx];
    if (grid[dropPoint.y] && grid[dropPoint.y][dropPoint.x] === '~') {
      dropPoints.pop();
      continue;
    }
    if (!dropFrom(dropPoint.x, dropPoint.y)) {
      dropPoints.splice(idx, 1);
    }
  }
  
  return result;
}