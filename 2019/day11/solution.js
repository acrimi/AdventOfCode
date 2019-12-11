const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;
  
  const black = 0;
  const white = 1;
  const symbols = [' ', '#']; // black and white
  const directions = [
    {x: 0, y: 1}, // up
    {x: 1, y: 0}, // right
    {x: 0, y: -1}, // down
    {x: -1, y: 0} // left
  ]
  const turns = [-1, 1]; // left and right
  const robot = {
    direction: 0, // up
    x: 0,
    y: 0
  };
  const bounds = {
    left: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    top: Number.MIN_SAFE_INTEGER,
    bottom: Number.MAX_SAFE_INTEGER,
  }
  const panels = {};
  const comp = new IntcodeComputer(input);

  const getPanel = (x, y) => {
    bounds.left = Math.min(x, bounds.left);
    bounds.bottom = Math.min(y, bounds.bottom);
    bounds.right = Math.max(x, bounds.right);
    bounds.top = Math.max(y, bounds.top);
    const row = panels[y] = panels[y] || {};
    const panel = row[x] = row[x] || {
      painted: false,
      color: black
    };
    return panel;
  }

  if (isPart2) {
    getPanel(0, 0).color = white;
  }

  while (true) {
    const panel = getPanel(robot.x, robot.y);
    let color;
    let turn;
    if ((color = comp.execute(panel.color)).done) {
      break;
    }
    if ((turn = comp.execute()).done) {
      break;
    }
    panel.color = color.value;
    if (!panel.painted) {
      result++;
    }
    panel.painted = true;

    robot.direction += turns[turn.value] + directions.length;
    robot.direction %= directions.length;
    const direction = directions[robot.direction];
    robot.x += direction.x;
    robot.y += direction.y;
  }

  if (isPart2) {
    result = '\n';
    for (let y = bounds.top; y >= bounds.bottom; y--) {
      for (let x = bounds.left; x <= bounds.right; x++) {
        result += symbols[getPanel(x, y).color];
      }
      result += '\n';
    }
  }

  return result;
}