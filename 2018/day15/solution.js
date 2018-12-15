module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const wall = '#';
  const empty = '.';
  const goblin = 'G';
  const elf = 'E';
  const initialHP = 200;
  const attackPower = 3;

  
  const possibleSteps = [
    {x: -1, y: 0, weight: 3},
    {x: 1, y: 0, weight: 2},
    {x: 0, y: -1, weight: 1},
    {x: 0, y: 1, weight: 0}
  ];
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
          attackPower: attackPower,
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
      if (!shortestPath || path.length < shortestPath.length) {
        shortestPath = path;
        nearestEnemy = enemy;
      } else if (path.length === shortestPath.length) {
        if (path.length === 1) {
          if (enemy.hp < nearestEnemy.hp) {
            shortestPath = path;
            nearestEnemy = enemy;
          }
        } else if (path[0].weight > shortestPath[0].weight) {
          shortestPath = path;
          nearestEnemy = enemy;
        }
      }
    }

    if (nearestEnemy) {
      return {
        path: shortestPath,
        unit: nearestEnemy
      };
    }
  }

  function findShortestPath(unit, target) {
    let availablePaths = [{
      steps: [],
      visited: new Set([(unit.x << 16) + unit.y]),
      x: unit.x,
      y: unit.y,
      score: distance(unit, target),
      weights: ''
    }];

    const queuePath = (path) => {
      let i = 0;
      for (; i < availablePaths.length; i++) {
        let path2 = availablePaths[i];
        if (path2.score > path.score) {
          break;
        } else if (path2.score === path.score) {
          let minLength = Math.min(path2.weights, path.weights);
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
          visited: new Set(currentPath.visited),
          x: currentPath.x + step.x,
          y: currentPath.y + step.y,
          weights: currentPath.weights + step.weight
        };

        let key = (nextPath.x << 16) + nextPath.y;
        if (nextPath.visited.has(key)) {
          // no backtracking
          continue;
        }
        nextPath.visited.add(key);
        nextPath.steps.push(step);

        if (nextPath.x === target.x && nextPath.y === target.y) {
          completedPath = nextPath;
          continue;
        }
        if (!isCellPassable(nextPath.x, nextPath.y)) {
          continue;
        }
        nextPath.score = nextPath.steps.length + distance(nextPath, target);
        queuePath(nextPath);
      }
    }

    return completedPath && completedPath.steps;
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

  let round = 0;
  main:
  while (true) {
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

  result = round * units.E.concat(units.G).reduce((accum, unit) => accum + unit.hp, 0);

  return result;
}