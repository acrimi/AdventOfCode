module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const start = {};
  const grid = input;

  const inputString = input.map(r => r.join('')).join('');
  const startIndex = inputString.indexOf('@');
  start.x = startIndex % grid[0].length;
  start.y = Math.floor(startIndex / grid[0].length);
  const totalKeys = inputString.match(/[a-z]/g).length;

  const history = [];
  const queue = [{
    x: start.x,
    y: start.y,
    steps: 0,
    keys: ''
  }];

  const markHistory = (x, y, keys) => {
    history[y] = history[y] || [];
    history[y][x] = history[y][x] || {};
    history[y][x][keys.split('').sort().join('')] = true;
  };

  const isVisited = (x, y, keys) => {
    return history[y] && history[y][x] && history[y][x][keys.split('').sort().join('')];
  }

  const insertPosition = (position) => {
    let i = 0;
    for (; i < queue.length; i++) {
      const other = queue[i];
      let result = position.steps - other.steps;
      if (result === 0) {
        result = other.keys - position.keys;
      }
      if (result < 0) {
        break;
      }
    }
    queue.splice(i, 0, position);
  };

  const attemptNewPosition = (previous, x, y) => {
    if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length ||
      isVisited(x, y, previous.keys)) {
      return;
    }

    const cell = grid[y][x];
    if (cell === '#' || (/[A-Z]/.test(cell) && previous.keys.indexOf(cell.toLowerCase()) === -1)) {
      return;
    }

    const newPosition = {
      x,
      y,
      steps: previous.steps + 1,
      keys: previous.keys
    };
    
    if (/[a-z]/.test(cell) && newPosition.keys.indexOf(cell) === -1) {
      newPosition.keys += cell;
    }
    // newPosition.history[`${newPosition.x},${newPosition.y}`] = newPosition.keys;
    markHistory(newPosition.x, newPosition.y, newPosition.keys);

    insertPosition(newPosition);
  };

  markHistory(start.x, start.y, '');
  while (queue.length) {
    const position = queue.shift();
    // testNumber === 2 && console.log(position);
    if (position.keys.length === totalKeys) {
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