const fs = require('fs');

module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let threshold = isTest ? 10 : 70;
  let points = [];

  for (let line of input) {
    let [_, x, y, dx, dy] = line.match(/position=<(?:\s+)?(-?\d+),(?:\s+)?(-?\d+)> velocity=<(?:\s+)?(-?\d+),(?:\s+)?(-?\d+)>/);

    let point = {
      x: +x,
      y: +y,
      dx: +dx,
      dy: +dy
    };

    points.push(point);
  }

  const writeGrid = (minX, minY) => {
    const grid = [];

    for (let point of points) {
      let row = point.y - minY;
      let column = point.x - minX;
      grid[row] = grid[row] || [];
      grid[row][column] = 'X';
    }

    let text = grid.map(row => {
      let str = '';
      for (let i = 0; i < row.length; i++) {
        str += row[i] || ' ';
      }
      return str;
    }).join('\n');

    result = `\n\n${text}\n`;
  };

  const updatePositions = () => {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = 0;
    let xPositions = {};
    let yPositions = {};

    for (let point of points) {
      point.x += point.dx;
      point.y += point.dy;
      
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);

      xPositions[point.x] = (xPositions[point.x] || 0) + 1;
      yPositions[point.y] = (yPositions[point.y] || 0) + 1;
    }

    if (maxX - minX <= threshold && maxY - minY <= threshold) {
      writeGrid(minX, minY);
      return true;
    }
  };

  let seconds = 1;
  while (!updatePositions()) {
    seconds++;
  }

  if (isPart2) {
    result = seconds;
  }

  return result;
}