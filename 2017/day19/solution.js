module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let steps = 1;
  let letters = '';
  let row = 0; 
  let column = 0;
  let directionX = 0;
  let directionY = 1;
  for (let col of input[0]) {
    if (col === '|') {
      break;
    }
    column++;
  }

  const getSpace = (x, y) => {
    return input[y] && input[y][x];
  };

  const changeDirection = () => {
    if (directionX === 0) {
      if (/-|[a-z]/i.test(getSpace(column-1, row))) {
        directionX = -1;
      } else {
        directionX = 1;
      }
      directionY = 0;
    } else {
      if (/\||[a-z]/i.test(getSpace(column, row-1))) {
        directionY = -1;
      } else {
        directionY = 1;
      }
      directionX = 0;
    }
  };

  const lookAhead = () => {
    let x = column;
    let y = row;
    while (true) {
      x += directionX;
      y += directionY;
      let next = getSpace(x, y);
      if (next === ' ') {
        return false;
      } else if (next === '|' && directionY !== 0) {
        return true;
      } else if (next === '-' && directionX !== 0) {
        return true;
      } else if (/\+|[a-z]/i.test(next)) {
        return true;
      }
    }
  }

  const move = () => {
    row += directionY;
    column += directionX;
    let next = getSpace(column, row);
    if (next === '+') {
      changeDirection();
    } else if (next && next.match(/[a-z]/i)) {
      letters += next;
    }
  };

  while (true) {
    move();
    steps++;
    if (!lookAhead()) {
      break;
    }
  }

  result = isPart2 ? steps : letters;

  return result;
}