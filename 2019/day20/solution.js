module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const start = {};
  const end = {};
  const openPortals = {};
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const cell = input[y][x];
      if (!cell.from && cell.match(/[A-Z]/)) {
        let x2 = input[y][x + 1] && input[y][x + 1].match(/[A-Z]/) ? x + 1 : x;
        let y2 = input[y + 1] && input[y + 1][x].match(/[A-Z]/) ? y + 1 : y;
        let x3 = x;
        if (x2 > x) {
          x3 = input[y][x2 + 1] && input[y][x2 + 1] === '.' ? x2 + 1 : x - 1;
        }
        let y3 = y;
        if (y2 > y) {
          y3 = input[y2 + 1] && input[y2 + 1][x] === '.' ? y2 + 1 : y - 1;
        }

        const name = input[y][x] + input[y2][x2];
        if (name === 'AA') {
          input[y][x] = input[y2][x2] = '#';
          start.x = x3;
          start.y = y3;
        } else if (name === 'ZZ') {
          input[y][x] = input[y2][x2] = '#';
          end.x = x3;
          end.y = y3;
        } else {
          const portal = {
            from: {
              x: x3,
              y: y3
            }
          };

          if (openPortals[name]) {
            portal.to = openPortals[name].from;
            openPortals[name].to = portal.from;
          } else {
            openPortals[name] = portal;
          }

          input[y][x] = input[y2][x2] = portal;
        }
      }
    }
  }

  const queue = [{
    x: start.x,
    y: start.y,
    steps: 0,
    trail: ''
  }];
  history = [];

  const markHistory = (x, y) => {
    history[y] = history[y] || [];
    history[y][x] = true;
  };

  const hasVisited = (x, y) => {
    return history[y] && history[y][x];
  };

  const insertPosition = (position) => {
    let i = 0;
    for (; i < queue.length; i++) {
      const other = queue[i];
      if (position.steps < other.steps) {
        break;
      }
    }
    queue.splice(i, 0, position);
  };

  const attemptNewPosition = (previous, x, y) => {
    if (hasVisited(x, y) || 
      y < 0 || y >= input.length ||
      x < 0 || x >= input[y].length) {
      return;
    }

    const cell = input[y][x];
    if (cell === '#') {
      return;
    }

    if (cell.to) {
      markHistory(x, y);
      x = cell.to.x;
      y = cell.to.y;
      if (hasVisited(x, y)) {
        return;
      }
    }

    insertPosition({
      x,
      y,
      steps: previous.steps + 1,
      trail: previous.trail + previous.x + ',' + previous.y + ' | '
    });
    markHistory(x, y);
  }

  markHistory(start.x, start.y);
  while (queue.length) {
    const position = queue.shift();
    if (position.x === end.x && position.y === end.y) {
      result = position.steps;
      break;
    }
    for (let dy = -1; dy <= 1; dy += 2) {
      attemptNewPosition(position, position.x, position.y + dy);
    }
    for (let dx = -1; dx <= 1; dx += 2) {
      attemptNewPosition(position, position.x + dx, position.y);
    }
  }

  return result;
}