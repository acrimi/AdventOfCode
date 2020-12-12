module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const ship = {
    x: 0,
    y: 0,
    dx: 1,
    dy: 0
  };
  const waypoint = {
    x: 10,
    y: 1
  };
  const commands = !isPart2 ? 
    {
      N: value => {
        ship.y += value
      },
      S: value => {
        ship.y -= value;
      },
      E: value => {
        ship.x += value;
      },
      W: value => {
        ship.x-= value;
      },
      L: value => {
        const turns = value / 90;
        for (let i = 0; i < turns; i++) {
          const dy = ship.dy;
          ship.dy = ship.dx;
          ship.dx = -dy;
        }
      },
      R: value => {
        const turns = value / 90;
        for (let i = 0; i < turns; i++) {
          const dy = ship.dy;
          ship.dy = -ship.dx;
          ship.dx = dy;
        }

      },
      F: value => {
        ship.x += ship.dx * value;
        ship.y += ship.dy * value;
      }
    }
    :
    {
      N: value => {
        waypoint.y += value
      },
      S: value => {
        waypoint.y -= value;
      },
      E: value => {
        waypoint.x += value;
      },
      W: value => {
        waypoint.x-= value;
      },
      L: value => {
        const turns = value / 90;
        for (let i = 0; i < turns; i++) {
          const y = waypoint.y;
          waypoint.y = waypoint.x;
          waypoint.x = -y;
        }
      },
      R: value => {
        const turns = value / 90;
        for (let i = 0; i < turns; i++) {
          const y = waypoint.y;
          waypoint.y = -waypoint.x;
          waypoint.x = y;
        }

      },
      F: value => {
        ship.x += waypoint.x * value;
        ship.y += waypoint.y * value;
      }
    };

  for (const command of input) {
    const op = command.substring(0, 1);
    const value = +(command.substring(1));
    commands[op](value);
  }

  result = Math.abs(ship.x) + Math.abs(ship.y);

  return result;
}