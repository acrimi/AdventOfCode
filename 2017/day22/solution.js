module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const up = 0, right = 1, down = 2, left = 3, directions = 4;
  const clean = '.', infected = '#', weakened = 'W', flagged = 'F';

  const burstCount = isPart2 ? 10000000 : 10000;
  let grid = input;
  let virus = {
    x: Math.floor(grid[0].length / 2),
    y: Math.floor(grid.length / 2),
    direction: up
  };

  const getNode = (x, y) => {
    return (grid[y] && grid[y][x]) || clean;
  };

  const setNode = (x, y, value) => {
    grid[y] = grid[y] || [];
    grid[y][x] = value;
  };

  const moveVirus = () => {
    switch (virus.direction) {
      case up:
        virus.y--;
        break;
      case down:
        virus.y++;
        break;
      case left:
        virus.x--;
        break;
      case right:
        virus.x++;
        break;
    }
  };

  const executeBurst = () => {
    let node = getNode(virus.x, virus.y);
    let newState = infected;
    if (node === clean) {
      newState = isPart2 ? weakened : infected;
      virus.direction = (virus.direction - 1 + directions) % directions;
    } else if (node === infected) {
      newState = isPart2 ? flagged : clean;
      virus.direction = (virus.direction + 1) % directions;
    } else if (node === flagged) {
      newState = clean;
      virus.direction = (virus.direction + 2) % directions;
    }

    setNode(virus.x, virus.y, newState);
    if (newState === infected) {
      result++;
    }
    
    moveVirus();
  };

  for (let i = 0; i < burstCount; i++) {
    executeBurst();
  }

  return result;
}