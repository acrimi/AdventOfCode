module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const maxMinutes = !isPart2 ? Number.MAX_SAFE_INTEGER : (isTest ? 10 : 200);
  const bug = '#';
  const empty = '.';
  const center = {
    x: Math.floor(input[0].length / 2),
    y: Math.floor(input.length / 2)
  };
  const previousStates = {};
  previousStates[input.join('')] = true;

  let lastState = {
    0: input
  };
  let min = isPart2 ? 0 : 1;
  let max = isPart2 ? 0 : -1;

  const getLayer = (index) => {
    lastState[index] = lastState[index] || [
      '.....',
      '.....',
      '.....',
      '.....',
      '.....'
    ];
    return lastState[index];
  };

  const countBugs = (index, x, y, toX, toY) => {
    if (!isPart2 && (toX < 0 || toY < 0 || toY >= input.length || toX >= input[0].length)) {
      return 0;
    }
    let count = 0;
    if (isPart2 && toX === center.x && toY === center.y) {
      // next level down
      const nextLayer = getLayer(index + 1);
      if (x === toX) {
        let y2 = 0;
        if (y > toY) {
          // bottom row
          y2 = nextLayer.length - 1;
        }
        for (let x2 = 0; x2 < nextLayer[y2].length; x2++) {
          if (nextLayer[y2][x2] === bug) {
            count++;
          }
        }
      } else if (y === toY) {
        let x2 = 0;
        if (x > toX) {
          // right column
          x2 = nextLayer[0].length - 1;
        }
        for (let y2 = 0; y2 < nextLayer.length; y2++) {
          if (nextLayer[y2][x2] === bug) {
            count++;
          }
        }
      }
    } else if (toX < 0) {
      // outer layer to left
      if (getLayer(index - 1)[center.y][center.x - 1] === bug) {
        count++;
      }
    } else if (toY < 0) {
      // outer layer up
      if (getLayer(index - 1)[center.y - 1][center.x] === bug) {
        count++;
      }
    } else if (toX >= input[0].length) {
      // outer layer to right
      if (getLayer(index - 1)[center.y][center.x + 1] === bug) {
        count++;
      }
    } else if (toY >= input.length) {
      // outer layer down
      if (getLayer(index - 1)[center.y + 1][center.x] === bug) {
        count++;
      }
    } else {
      if (getLayer(index)[toY][toX] === bug) {
        count++;
      }
    }
    return count;
  };

  for (let i = 0; i < maxMinutes; i++) {
    result = 0;
    const newState = {};
    let newMin;
    let newMax = 0;
    for (let z = min - 1; z <= max + 1; z++) {
      const layer = getLayer(z);
      const newLayer = [];
      let bugsInLayer = 0;
      for (let y = 0; y < layer.length; y++) {
        const row = layer[y];
        let newRow = '';
        for (let x = 0; x < row.length; x++) {
          if (isPart2 && y === center.y && x === center.x) {
            newRow += '.';
            continue;
          }
          let adjacentBugs = 0;
          for (let dy = -1; dy <= 1; dy += 2) {
            adjacentBugs += countBugs(z, x, y, x, y + dy);
          }
          for (let dx = -1; dx <= 1; dx += 2) {
            adjacentBugs += countBugs(z, x, y, x + dx, y);
          }

          let cell = row[x];
          if (cell === bug && adjacentBugs !== 1) {
            cell = empty;
          } else if (cell === empty && adjacentBugs > 0 && adjacentBugs < 3) {
            cell = bug;
          }
          newRow += cell;
          if (cell === bug) {
            bugsInLayer++;
          }
        }
        newLayer.push(newRow);
      }
      newState[z] = newLayer;

      result += bugsInLayer;
      if (bugsInLayer > 0) {
        if (newMin == null) {
          newMin = z;
        }
        newMax = z;
      }
    }
    lastState = newState;

    if (!isPart2) {
      const str = lastState[0].join('');
      if (previousStates[str]) {
        break;
      }
      previousStates[str] = true;
    }

    if (isPart2) {
      min = newMin;
      max = newMax;
    }
  }

  if (!isPart2) {
    result = 0;
    let value = 1;
    const str = lastState[0].join('');
    for (let char of str) {
      if (char === bug) {
        result += value;
      }
      value *= 2;
    }
  }

  return result;
}