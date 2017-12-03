module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let value = 1;
  let x = 0;
  let y = 0;
  let directionX = 1;
  let directionY = 1;

  let edges = {
    x: {
      '1': 0,
      '-1': 0
    },
    y: {
      '1': 0,
      '-1': 0
    }
  };

  let values = {
    '0_0': 1
  };
  const getValue = (x, y) => {
    return (values[(x-1) + '_' + y] || 0) +
          (values[(x+1) + '_' + y] || 0) +
          (values[(x) + '_' + (y-1)] || 0) +
          (values[(x) + '_' + (y+1)] || 0) +
          (values[(x-1) + '_' + (y-1)] || 0) +
          (values[(x-1) + '_' + (y+1)] || 0) +
          (values[(x+1) + '_' + (y-1)] || 0) +
          (values[(x+1) + '_' + (y+1)] || 0);
  }

  let moveX = true;
  while (value < input || (isPart2 && value == input)) {
    if (moveX) {
      x += directionX;
      if (Math.sign(x - edges.x[directionX]) == Math.sign(directionX)) {
        edges.x[directionX] = x;
        directionX = -directionX;
        moveX = false;
      }
    } else {
      y += directionY;
      if (Math.sign(y - edges.y[directionY]) == Math.sign(directionY)) {
        edges.y[directionY] = y;
        directionY = -directionY;
        moveX = true;
      }
    }

    if (!isPart2) {
      value++;
    } else {
      value = getValue(x, y);
      values[x + '_' + y] = value;
    }
  }

  if (!isPart2) {
    result = Math.abs(x) + Math.abs(y);
  } else {
    result = value;
  }

  return result;
}