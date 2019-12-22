module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const start = {};
  const grid = input;

  let inputString = input.map(r => r.join('')).join('');
  const startIndex = inputString.indexOf('@');
  start.x = startIndex % grid[0].length;
  start.y = Math.floor(startIndex / grid[0].length);
  const totalKeys = inputString.match(/[a-z]/g).length;
  if (isPart2 && !isTest) {
    grid[start.y - 1][start.x - 1] = '@';
    grid[start.y - 1][start.x + 1] = '@';
    grid[start.y + 1][start.x - 1] = '@';
    grid[start.y + 1][start.x + 1] = '@';
    grid[start.y][start.x] = '#';
    grid[start.y][start.x - 1] = '#';
    grid[start.y][start.x + 1] = '#';
    grid[start.y - 1][start.x] = '#';
    grid[start.y + 1][start.x] = '#';
    inputString = grid.map(r => r.join('')).join('');
  }

  const collectAllKeys = (start) => {
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
      if (cell === '#' || 
        (/[A-Z]/.test(cell) && previous.keys.indexOf(cell.toLowerCase()) === -1 &&
        (!isPart2 || start.keys.indexOf(cell.toLowerCase()) >= 0))) {
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
      markHistory(newPosition.x, newPosition.y, newPosition.keys);

      insertPosition(newPosition);
    };

    markHistory(start.x, start.y, '');
    while (queue.length) {
      const position = queue.shift();
      if ((!isPart2 && position.keys.length === totalKeys) ||
        (isPart2 && position.keys.length === start.keys.length)) {
        return position.steps;
      }
      for (let dy = -1; dy <= 1; dy += 2) {
        attemptNewPosition(position, position.x, position.y + dy);
      }
      for (let dx = -1; dx <= 1; dx += 2) {
        attemptNewPosition(position, position.x + dx, position.y);
      }
    }
  };

  if (!isPart2) {
    result = collectAllKeys(start);
  } else {
    const vaultKeys = [];
    if (isPart2) {
      const keyRegex = /[a-z]/g;
      let match;
      while ((match = keyRegex.exec(inputString)) != null) {
        const key = match[0];
        const index = match.index;
        const x = index % grid[0].length;
        const y = Math.floor(index / grid[0].length);
        const vault = Math.floor(y / (grid.length / 2)) * 2 + Math.floor(x / (grid[y].length / 2));
        vaultKeys[vault] = (vaultKeys[vault] || '') + key;
      }
    }
    const bots = [];
    let index = 0;
    while ((index = inputString.indexOf('@', index)) >= 0) {
      bots.push({
        x: index % grid[0].length,
        y: Math.floor(index / grid[0].length),
        keys: vaultKeys.shift()
      });
      index++;
    }

    for (let bot of bots) {
      const steps = collectAllKeys(bot);
      result += steps;
    }
  }

  return result;
}