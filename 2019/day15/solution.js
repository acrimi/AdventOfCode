const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);
  const directions = [
    {x: 0, y: 1},
    {x: 0, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0}
  ];
  const wallStatus = 0;
  const successStatus = 1;
  const o2Status = 2;
  let visited = {};
  const queue = [];
  const o2Position = {};
  const grid = {};

  const isVisited = (x, y) => {
    return visited[y] && visited[y][x];
  };

  const setVisited = (x, y) => {
    visited[y] = visited[y] || {};
    visited[y][x] = true;
  };

  const isWall = (x, y) => {
    return !grid[y] || grid[y][x] === wallStatus;
  }

  const setTile = (x, y, tile) => {
    grid[y] = grid[y] || {};
    grid[y][x] = tile;
  }

  const queueNextPositions = (start) => {
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nextX = start.x + direction.x;
      const nextY = start.y + direction.y;
      if (!isVisited(nextX, nextY)) {
        queue.push({
          x: nextX,
          y: nextY,
          inputs: start.inputs.concat(i + 1)
        });
      }
    }
  };

  setVisited(0, 0);
  queueNextPositions({
    inputs: [],
    x: 0,
    y: 0
  });

  while (queue.length > 0) {
    const position = queue.shift();
    comp.reset(input);
    const newStatus = comp.execute(position.inputs, true).value.pop();
    setVisited(position.x, position.y);
    if (newStatus === o2Status) {
      o2Position.x = position.x;
      o2Position.y = position.y;
      result = position.inputs.length;
      if (!isPart2) {
        break;
      }
    } else if (newStatus === successStatus) {
      queueNextPositions(position);
    }
    setTile(position.x, position.y, newStatus);
  }

  if (isPart2) {
    visited = {};
    setVisited(o2Position.x, o2Position.y);
    queueNextPositions({
      x: o2Position.x,
      y: o2Position.y,
      inputs: [] // inefficient but i'm lazy and just want to reuse pt 1
    });

    result = 0;
    while (queue.length > 0) {
      const position = queue.shift();
      setVisited(position.x, position.y);
      if (!isWall(position.x, position.y)) {
        result = Math.max(result, position.inputs.length);
        queueNextPositions(position);
      }
    }
  }

  return result;
}