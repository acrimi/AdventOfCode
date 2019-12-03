module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const grid = {};

  const wire1 = input[0].split(',');
  const wire2 = input[1].split(',');

  const traceWire = (directions, name)  => {
    const position = {
      x: 0,
      y: 0
    };
    let steps = 0;
    let closestCrossing;

    for (let step of directions) {
      const direction = step[0];
      const stride = +(step.substring(1));
      let scalar = 1;
      let prop = 'x';
      switch (direction) {
        case 'L':
          scalar = -1;
          break;
        case 'U':
          prop = 'y';
          break;
        case 'D':
          prop = 'y';
          scalar = -1;
          break;
      }

      for (let i = 0; i < stride; i++) {
        steps++;
        position[prop] += scalar;
        const key = position.x + "," + position.y;
        const cell = grid[key] = grid[key] || {};
        cell[name] = Math.min(cell[name] || steps, steps);

        if (cell.one && cell.two) {
          const dist = isPart2 ? cell.one + cell.two : Math.abs(position.y) + Math.abs(position.x);
          if (closestCrossing == undefined) {
            closestCrossing = dist;
          } else { 
            closestCrossing = Math.min(closestCrossing, dist);
          }
        }
      }
    }

    return closestCrossing;
  };

  traceWire(wire1, 'one');
  result = traceWire(wire2, 'two');

  return result;
}