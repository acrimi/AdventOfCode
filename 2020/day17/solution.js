const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const active = '#';
  const inactive = '.';
  const cycles = 6;
  let state = {};
  let min = {
    x: -1,
    y: -1,
    z: -1,
    w: 0
  };
  let max = {
    x: input[0].length,
    y: input.length,
    z: 1,
    w: 0
  };
  if (isPart2) {
    min.w = -1;
    max.w = 1;
  }
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
        setCube(input[y][x], x, y, 0, 0, state);
    }
  }

  function getCube(x, y, z, w, state) {
    return state[x] && state[x][y] && state[x][y][z] && state[x][y][z][w] || inactive;
  }

  function getNeighbors(x, y, z, w, state) {
    const neighbors = [];
    for (let x2 = x - 1; x2 <= x + 1; x2++) {
      for (let y2 = y - 1; y2 <= y + 1; y2++) {
        for (let z2 = z - 1; z2 <= z + 1; z2++) {
          for (let w2 = w - 1; w2 <= w + 1; w2++) {
            if (x2 == x && y2 == y && z2 == z && w2 == w) {
              continue;
            }
            neighbors.push(getCube(x2, y2, z2, w2, state));
          }
        }
      }
    }
    return neighbors;
  }

  function count(target, arr) {
    let count = 0;
    for (const item of arr) {
      if (item == target) {
        count++;
      }
    }
    return count;
  }

  function setCube(value, x, y, z, w, state) {
    state[x] = state[x] || {};
    state[x][y] = state[x][y] || {};
    state[x][y][z] = state[x][y][z] || {};
    state[x][y][z][w] = value;
  }
  
  function prettyPrint() {
    let out = '';
    for (let z = min.z; z <= max.z; z++) {
      for (let y = min.y; y <= max.y; y++) {
        for (let x = min.x; x <= max.x; x++) {
          out += getCube(x, y, z, state);
        }
        out += '\n';
      }
      out += '\n';
    }
    console.log(out);
  }

  for (let i = 0; i < cycles; i++) {
    const newState = {};
    let newMins = {...min};
    let newMaxes = {...max};
    result = 0;
    for (let x  = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        for (let z = min.z; z <= max.z; z++) {
          for (let w = min.w; w <= max.w; w++) {
            const cube = getCube(x, y, z, w, state);
            let newCube = cube;
            const neighbors = getNeighbors(x, y, z, w, state);
            const activeCount = count(active, neighbors);
            if (cube == inactive && activeCount == 3) {
              newCube = active;
            } else if (cube == active && activeCount !== 2 && activeCount !== 3) {
              newCube = inactive;
            }
            setCube(newCube, x, y, z, w, newState);
            if (newCube == active) {
              result++;
              newMins.x = Math.min(newMins.x, x - 1);
              newMins.y = Math.min(newMins.y, y - 1);
              newMins.z = Math.min(newMins.z, z - 1);
              newMaxes.x = Math.max(newMaxes.x, x + 1);
              newMaxes.y = Math.max(newMaxes.y, y + 1);
              newMaxes.z = Math.max(newMaxes.z, z + 1);
              if (isPart2) {
                newMins.w = Math.min(newMins.w, w - 1);
                newMaxes.w = Math.max(newMaxes.w, w + 1);
              }
            }
          }
        }
      }
    }
    state = newState;
    min = newMins;
    max = newMaxes;
  }

  return result;
}