module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const days = 100;
  const position = {
    x: 0,
    y: 0
  };
  let flippedTiles = {};

  function move(direction) {
    switch (direction) {
      case 'e':
        position.x++;
        break;
      case 'w':
        position.x--;
        break;
      case 'se':
        position.y--;
        break;
      case 'sw':
        position.y--;
        position.x--;
        break;
      case 'ne':
        position.y++;
        position.x++;
        break;
      case 'nw':
        position.y++;
        break;
    }
  }

  function flipPosition() {
    const key = position.x + '|' + position.y;
    flippedTiles[key] = !flippedTiles[key]; 
  }

  for (const line of input) {
    position.x = position.y = 0;
    let pending = '';
    for (let i = 0; i < line.length; i++) {
      const direction = pending + line[i];
      if (direction == 's' || direction == 'n') {
        pending = direction;
        continue;
      }
      move(direction);
      pending = '';
    }
    flipPosition();
  }
  if (isPart2) {
    function getNeighbors(x, y) {
      return [
        { x, y: y + 1},
        { x, y: y - 1},
        { x: x - 1, y: y - 1},
        { x: x + 1, y: y + 1},
        { x: x - 1, y },
        { x: x + 1, y }
      ];
    }

    function checkToStayBlack(x, y, state) {
      const count = getNeighbors(x, y)
        .map(p => state[p.x + '|' + p.y])
        .reduce((acc, i) => i == true ? acc + 1 : acc, 0);
      return count > 0 && count <= 2;
    }

    function checkToTurnBlack(x, y, state) {
      return getNeighbors(x, y)
        .map(p => state[p.x + '|' + p.y])
        .reduce((acc, i) => i == true ? acc + 1 : acc, 0) == 2;
    }

    for (let i = 0; i < days; i++) {
      const newState = {};
      for (const tile in flippedTiles) {
        if (newState[tile] != null) {
          continue;
        }
        const [x, y] = tile.split('|');
        if (flippedTiles[tile]) {
          newState[tile] = checkToStayBlack(+x, +y, flippedTiles);
          getNeighbors(+x, +y).forEach(n => {
            const t = n.x + '|' + n.y;
            if (!flippedTiles[t]) {
              newState[t] = checkToTurnBlack(n.x, n.y, flippedTiles);
            }
          });
        } else {
          newState[tile] = checkToTurnBlack(+x, +y, flippedTiles);
        }
      }
      flippedTiles = newState;
    }
  }

  for (const isBlack of Object.values(flippedTiles)) {
    if (isBlack) {
      result++;
    }
  }

  return result;
}