module.exports = (input, isPart2, isTest) => {
  let result = 0;
  
  const getCurrentDistance = (x, y) => {
    return Math.max(Math.abs(x), Math.abs(Math.ceil(y)));
  };

  let maxDistance = 0;
  let x = 0;
  let y = 0;
  for (let move of input) {
    switch (move) {
      case 'n':
        y++;
        break;
      case 's':
        y--;
        break;
      case 'nw':
        y += .5;
        x--;
        break;
      case 'ne':
        y += .5;
        x++;
        break;
      case 'sw':
        y -= .5;
        x--;
        break;
      case 'se':
        y -= .5;
        x++;
        break;
    }

    maxDistance = Math.max(maxDistance, getCurrentDistance(x, y));
  }

  let distance = getCurrentDistance(x, y);

  if (!isPart2) {
    result = distance;
  } else {
    result = maxDistance;
  }

  return result;
}