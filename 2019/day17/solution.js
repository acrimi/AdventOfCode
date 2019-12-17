const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);
  const grid = [[]];
  const robotMarkers = ['<', '^', '>', 'v'];
  const directions = [
    {x: -1, y: 0},
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1}
  ];
  const functionNames = ['A', 'B', 'C'];
  const robot = {};

  const isBelowIntersection = (x, y) => {
    const centerRow = y > 0 ? grid[y - 1] : null;
    return centerRow &&
      centerRow[x] === '#' &&
      (x === 0 || centerRow[x - 1] === '#') &&
      (x === centerRow.length - 1 || centerRow[x + 1] === '#') &&
      (y === 1 || grid[y - 2][x] === '#');
  };

  comp.execute(null, true);
  const outputs = comp.getOutputs();
  let row = grid[0];
  for (let cell of outputs) {
    const char = String.fromCharCode(cell);
    if (char === '\n') {
      row = [];
      grid.push(row);
    } else {
      row.push(char);
      if (robotMarkers.includes(char)) {
        robot.x = row.length - 1;
        robot.y = grid.length - 1;
        robot.directionIndex = robotMarkers.indexOf(char);
      } else if (char === '#' && isBelowIntersection(row.length - 1, grid.length - 1)) {
        result += (row.length - 1) * (grid.length - 2);
      }
    }
  }

  const getNextCell = (position, direction) => {
    const x = position.x + direction.x;
    const y = position.y + direction.y;
    return grid[y] && grid[y][x];
  };

  if (isPart2) {
    input[0] = 2;
    comp.reset(input);

    // calculate path
    let path = '';
    let advancement = 0;
    while (true) {
      const currentDirection = directions[robot.directionIndex];
      if (getNextCell(robot, currentDirection) === '#') {
        advancement++;
        robot.x += currentDirection.x;
        robot.y += currentDirection.y;
      } else {
        if (advancement > 0) {
          path += advancement + ',';
          advancement = 0;
        }
        const turn1 = directions[(robot.directionIndex - 1 + directions.length) % directions.length];
        const turn2 = directions[(robot.directionIndex + 1) % directions.length];
        if (getNextCell(robot, turn1) === '#') {
          path += 'L,';
          robot.directionIndex = directions.indexOf(turn1);
        } else if (getNextCell(robot, turn2) === '#') {
          path += 'R,';
          robot.directionIndex = directions.indexOf(turn2);
        } else {
          break;
        }
      }
    }

    // find best substrings of path (< 20, repeat >= 3x, as long as possible)
    let tempPath = path.substring(0, path.length - 1);
    let movementFunctions = [];
    for (let i = 0; i < 3; i++) {
      let fn = '';
      for (let step of tempPath.split(',')) {
        if (fn.length + step.length > 20) {
          break;
        }
        const extendedFn = fn.length ? fn + ',' + step : step;
        if (tempPath.match(new RegExp(extendedFn, 'g')).length < 3) {
          break;
        }
        fn = extendedFn;
      }
      tempPath = tempPath.replace(new RegExp(fn + ',?', 'g'), '');
      movementFunctions.push(fn);
    }

    // Determine order of functions in path string
    const functionOrder = [];
    for (let i = 0; i < movementFunctions.length; i++) {
      const name = functionNames[i];
      const regex = new RegExp(movementFunctions[i], 'g');
      let result;
      while((result = regex.exec(path)) !== null) {
        functionOrder.push({
          name: name,
          index: result.index
        });
      }
    }
    functionOrder.sort((a, b) => a.index - b.index);
    
    // concatenate routine + functions + video feed
    const inputStr =
      functionOrder.map(f => f.name).join(',') + '\n' +
      movementFunctions.join('\n') + '\n'+
      'n\n';
    // ASCII conversion
    const inputs = inputStr.split('').map(c => c.charCodeAt(0));
    comp.execute(inputs, true);
    result = comp.getOutputs().pop();
  }

  return result;
}