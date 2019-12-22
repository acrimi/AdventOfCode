module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const targets = {};
  const grid = input;
  const keys = [];

  const inputString = input.map(r => r.join('')).join('');
  const targetRegex = /@|[a-z]/g;
  let match;
  while ((match = targetRegex.exec(inputString)) != null) {
    const symbol = match[0];
    if (symbol !== '@') {
      keys.push(symbol);
    }
    targets[symbol] = {
      position: {
        x: match.index % grid[0].length,
        y: Math.floor(match.index / grid[0].length)
      },
      distances: {}
    };
  }

  const measureDistances = (start) => {
    const props = targets[start];
    const history = [];
    const queue = [{
      x: props.position.x,
      y: props.position.y,
      steps: 0,
      locks: ''
    }];

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
        y < 0 || y >= grid.length ||
        x < 0 || x >= grid[y].length) {
        return;
      }
  
      const cell = grid[y][x];
      if (cell === '#') {
        return;
      }

      const newPosition = {
        x,
        y,
        steps: previous.steps + 1,
        locks: previous.locks
      };

      if (/[A-Z]/.test(cell)) {
        newPosition.locks += cell.toLowerCase();
      }
      if (cell.match(targetRegex)) {
        props.distances[cell] = {
          distance: newPosition.steps,
          locks: newPosition.locks
        };
        targets[cell].distances[start] = {
          distance: newPosition.steps,
          locks: newPosition.locks
        }
      }
      markHistory(x, y);

      insertPosition(newPosition);
    };

    markHistory(props.position.x, props.position.y);
    while (queue.length && Object.keys(props.distances).length < keys.length) {
      const position = queue.shift();
      for (let dy = -1; dy <= 1; dy += 2) {
        attemptNewPosition(position, position.x, position.y + dy);
      }
      for (let dx = -1; dx <= 1; dx += 2) {
        attemptNewPosition(position, position.x + dx, position.y);
      }
    }
  };

  const getOptimalRoute = () => {
    const queue = [{
      steps: 0,
      keys: '@'
    }];
    
    const insertRoute = (route) => {
      let i = 0;
      for (; i < queue.length; i++) {
        const other = queue[i];
        let result = route.steps - other.steps;
        if (result === 0) {
          result = other.keys.length - route.keys.length;
        }
        if (result < 0) {
          break;
        }
      }
      queue.splice(i, 0, route);
    };
    
    const extendRoute = (route) => {
      const startingKey = route.keys[route.keys.length - 1];
      const possibleTargets = targets[startingKey].distances;
      keyLoop:
      for (let key of keys) {
        if (route.keys.indexOf(key) >= 0) {
          continue;
        }
    
        const target = possibleTargets[key];
        for (let i = 0; i < target.locks.length; i++) {
          if (route.keys.indexOf(target.locks[i]) === -1) {
            // missing lock
            continue keyLoop;
          }
        }
  
        insertRoute({
          steps: route.steps + target.distance,
          keys: route.keys + key
        });
      }
    };
    
    while (queue.length) {
      const route = queue.shift();
      if (route.keys.length === keys.length + 1) {
        return route.steps;
      }
      extendRoute(route);
    }
  }

  for (let key of keys) {
    measureDistances(key);
  }

  result = getOptimalRoute();

  return result;
}