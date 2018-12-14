module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let grid = [];
  let cartCount = 0;
  let turnRules = [
    (cart) => {
      if (cart.dx !== 0) {
        cart.dy = -cart.dx;
        cart.dx = 0;
      } else {
        cart.dx = cart.dy;
        cart.dy = 0;
      }
    }, 
    () => {},
    (cart) => {
      if (cart.dx !== 0) {
        cart.dy = cart.dx;
        cart.dx = 0;
      } else {
        cart.dx = -cart.dy;
        cart.dy = 0;
      }
    }, 
  ];

  const getObjectForChar = (char) => {
    switch (char) {
      case '>':
        return {
          dx: 1,
          dy: 0,
          turns: 0,
          track: '-'
        }
      case '<':
        return {
          dx: -1,
          dy: 0,
          turns: 0,
          track: '-'
        }
      case '^':
        return {
          dx: 0,
          dy: -1,
          turns: 0,
          track: '|'
        }
      case 'v':
        return {
          dx: 0,
          dy: 1,
          turns: 0,
          track: '|'
        }
    }

    return char;
  };

  const updateCartForTrack = (cart, track) => {
    switch (track) {
      case '\\':
        if (cart.dx !== 0) {
          cart.dy = cart.dx;
          cart.dx = 0;
        } else {
          cart.dx = cart.dy;
          cart.dy = 0;
        }
        break;
      case '/':
        if (cart.dx !== 0) {
          cart.dy = -cart.dx;
          cart.dx = 0;
        } else {
          cart.dx = -cart.dy;
          cart.dy = 0;
        }
        break;
      case '+':
        turnRules[cart.turns](cart);
        cart.turns++;
        cart.turns %= turnRules.length;
        break;
    }

    cart.track = track;
  }

  for (let i = 0; i < input.length; i++) {
    let row = input[i];
    grid[i] = grid[i] || [];
    for (let j = 0; j < row.length; j++) {
      grid[i][j] = getObjectForChar(row[j]);
      if (grid[i][j].track) {
        cartCount++;
      }
    }
  }

  main:
  while (true) {
    let updatedCarts = new Set();
    let lastUpdatedCart;
    for (let i = 0; i < grid.length; i++) {
      let row = grid[i];
      for (let j = 0; j < row.length; j++) {
        let obj = row[j];
        if (obj.track && !updatedCarts.has(obj)) {
          // cart
          let x = j + obj.dx;
          let y = i + obj.dy;
          row[j] = obj.track;

          let nextPos = grid[y][x];
          if (nextPos.track) {
            // collision
            if (!isPart2) {
              result = x + ',' + y;
              break main;
            } else {
              grid[y][x] = nextPos.track;
              cartCount -= 2;
              continue;
            }
          }

          updateCartForTrack(obj, nextPos);
          grid[y][x] = obj;
          updatedCarts.add(obj);
          lastUpdatedCart = x + ',' + y;
        }
      }
    }

    if (cartCount === 1) {
      result = lastUpdatedCart;
      break;
    }
  }

  return result;
}