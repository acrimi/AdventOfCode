let testNo = 1;
module.exports = (input, isPart2, isTest) => {
  if (!isPart2) {
    return run(3, input, false, true);
  } else {
    return 0;
  }
}

function run(elfPower, input, isPart2, isTest) {
  const empty = '.';
  const goblin = 'G';
  const elf = 'E';
  const initialHP = 200;
  const possibleSteps = [
    {x: 0, y: -1, weight: 3},
    {x: -1, y: 0, weight: 2},
    {x: 1, y: 0, weight: 1},
    {x: 0, y: 1, weight: 0}
  ];

  const attackPower = {
    G: 3,
    E: elfPower
  };
  const units = {
    G: [],
    E: []
  };
  const enemy = {
    G: elf,
    E: goblin
  };
  const arena = [];
  for (let i = 0; i < input.length; i++) {
    arena.push(input[i].split('').map((cell, index) => {
      if (cell === goblin || cell === elf) {
        let unit = {
          type: cell,
          hp: initialHP,
          attackPower: attackPower[cell],
          x: index,
          y: i
        };
        units[cell].push(unit);
        return unit;
      }

      return cell;
    }));
  }

  function isCellPassable(x, y) {
    return y >= 0 && y < arena.length && x >= 0 && x < arena[y].length && arena[y][x] === empty;
  }

  function distance(unit1, unit2) {
    return Math.abs(unit1.x - unit2.x) + Math.abs(unit1.y - unit2.y);
  }

  function isHigherOrder(pos1, pos2) {
    return pos1.y < pos2.y || (pos1.y === pos2.y && pos1.x < pos2.x);
  }

  function findNearestEnemy(unit) {
    let enemies = units[enemy[unit.type]];

    let shortestPath;
    let nearestEnemy;
    for (let enemy of enemies) {
      if (shortestPath && distance(unit, enemy) > shortestPath.length) {
        continue;
      }

      let path = findShortestPath(unit, enemy);
      if (!path) {
        continue;
      }
      if (!shortestPath || path.steps.length < shortestPath.steps.length) {
        shortestPath = path;
        nearestEnemy = enemy;
      } else if (path.steps.length === shortestPath.steps.length) {
        if (path.steps.length === 1 || (path.steps.length === 2 && path.steps[0] === shortestPath.steps[0])) {
          if (enemy.hp < nearestEnemy.hp || (enemy.hp === nearestEnemy.hp && path.weights > shortestPath.weights)) {
            shortestPath = path;
            nearestEnemy = enemy;
          }
        } else if (isHigherOrder(path, shortestPath) ||
          (path.x === shortestPath.x && path.y === shortestPath.y && path.weights > shortestPath.weights)) {
          shortestPath = path;
          nearestEnemy = enemy;
        }
      }
    }

    if (nearestEnemy) {
      return {
        path: shortestPath.steps,
        unit: nearestEnemy
      };
    }
  }

  function findShortestPath(unit, target) {
    let availablePaths = [{
      steps: [],
      x: unit.x,
      y: unit.y,
      score: distance(unit, target),
      weights: ''
    }];
    let visited = new Map([[(unit.x << 16) + unit.y, '']]);

    const queuePath = (path) => {
      let i = 0;
      for (; i < availablePaths.length; i++) {
        let path2 = availablePaths[i];
        if (path2.score > path.score) {
          break;
        } else if (path2.score === path.score) {
          let minLength = Math.min(path2.weights.length, path.weights.length);
          if (path2.weights.substring(0, minLength) < path.weights.substring(0, minLength)) {
            break;
          }
        }
      }
      availablePaths.splice(i, 0, path);
    };

    let completedPath;
    while (availablePaths.length) {
      let currentPath = availablePaths.shift();
      if (!currentPath) {
        break;
      }
      if (completedPath &&
        (currentPath.score > completedPath.steps.length ||
          completedPath.weights.substring(0, currentPath.weights.length) > currentPath.weights)) {
        continue;
      }

      for (let i = 0; i < possibleSteps.length; i++) {
        let step = possibleSteps[i];
        let nextPath = {
          steps: [...currentPath.steps],
          x: currentPath.x,
          y: currentPath.y,
          weights: currentPath.weights + step.weight
        };

        let nextX = currentPath.x + step.x;
        let nextY = currentPath.y + step.y;

        let key = (nextX << 16) + nextY;
        let previousWeight = visited.get(key);
        if (previousWeight && 
          (previousWeight.length < nextPath.weights.length || 
            (previousWeight.length === nextPath.weights.length && previousWeight > nextPath.weights))) {
          // we've already been here on a higher priority path
          continue;
        }
        visited.set(key, nextPath.weights);
        nextPath.steps.push(step);

        if (nextX === target.x && nextY === target.y) {
          if (!completedPath ||
            isHigherOrder(nextPath, completedPath) ||
            (nextPath.x === completedPath.x && nextPath.y === completedPath.y && nextPath.weights > completedPath.weights)) {
            completedPath = nextPath;
          }
          continue;
        }
        if (!isCellPassable(nextX, nextY)) {
          continue;
        }
        nextPath.x = nextX;
        nextPath.y = nextY;
        nextPath.score = nextPath.steps.length + distance(nextPath, target);
        queuePath(nextPath);
      }
    }

    return completedPath;
  }

  function moveTowardTarget(unit, path) {
    if (path.length === 1) {
      // already in range
      return;
    }
    arena[unit.y][unit.x] = empty;
    unit.x += path[0].x;
    unit.y += path[0].y;
    arena[unit.y][unit.x] = unit;
  }

  function attackTarget(unit, target) {
    if (distance(unit, target) > 1) {
      return;
    }
    target.hp -= unit.attackPower;
    if (target.hp <= 0) {
      units[target.type].splice(units[target.type].indexOf(target), 1);
      arena[target.y][target.x] = empty;
    }
  }

  let out = '';
  let round = 0;
  main:
  while (true) {
    out += round + '\n';
    for (let row of arena) {
      let stats = [];
      for (let cell of row) {
        out += cell.type || cell;
        if (cell.type) {
          stats.push(`${cell.type}(${cell.hp})`);
        }
      }
      if (stats.length) {
        out += ' ' + stats.join(',');
      }
      out += '\n';
    }
    out += '\n';

    let updated = new Set();
    for (let y = 1; y < arena.length - 1; y++) {
      for (let x = 1; x < arena[y].length - 1; x++) {
        let unit = arena[y][x];
        if (unit.type && !updated.has(unit)) {
          if (units[enemy[unit.type]].length === 0) {
            break main;
          }

          let target = findNearestEnemy(unit);
          if (!target) {
            continue;
          }

          moveTowardTarget(unit, target.path);
          attackTarget(unit, target.unit);

          updated.add(unit);
        }
      }
    }

    round++;
  }

  
  out += 'END\n';
  for (let row of arena) {
    let stats = [];
    for (let cell of row) {
      out += cell.type || cell;
      if (cell.type) {
        stats.push(`${cell.type}(${cell.hp})`);
      }
    }
    if (stats.length) {
      out += ' ' + stats.join(',');
    }
    out += '\n';
  }

  const fs = require('fs');
  fs.writeFileSync(`out${testNo++}.txt`, out);

  if (!isTest) {
    fs.writeFileSync('decisions.txt', decisionLog);
  }

  return round * units.E.concat(units.G).reduce((accum, unit) => accum + unit.hp, 0);
}