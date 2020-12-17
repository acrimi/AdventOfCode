module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const active = '#';
  const inactive = '.';
  const cycles = 6;
  const dimensions = isPart2 ? 4 : 3;
  let state = {};
  let min = [-1, -1];
  let max = [input[0].length, input.length];
  for (let i = min.length; i < dimensions; i++) {
    min.push(-1);
    max.push(1);
  }
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinates = [x, y];
      for (let i = coordinates.length; i < dimensions; i++) {
        coordinates.push(0);
      }
      setCube(input[y][x], coordinates, state);
    }
  }

  function getCube(coordinates, state) {
    const key = coordinates.join('|');
    return state[key] || inactive;
  }

  function getCoordinatesInRange(start, end) {
    const nextStart = start.shift();
    const nextEnd = end.shift();
    const values = [];
    for (let i = nextStart; i <= nextEnd; i++) {
      values.push([i]);
    }
    if (start.length == 0) {
      return values;
    }
    return getCoordinatesInRange(start, end).flatMap(p => values.map(v => v.concat(p)));
  }

  function isSamePosition(coordinates1, coordinates2) {
    for (let i = 0; i < coordinates1.length; i++) {
      if (coordinates1[i] !== coordinates2[i]) {
        return false;
      }
    }
    return true;
  }

  function getNeighbors(coordinates, state) {
    const neighbors = [];
    const neighborCoordinates = getCoordinatesInRange(coordinates.map(c => +c - 1), coordinates.map(c => +c + 1));
    for (const nc of neighborCoordinates) {
      if (!isSamePosition(nc, coordinates)) {
        neighbors.push(getCube(nc, state));
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

  function setCube(value, coordinates, state) {
    const key = coordinates.join('|');
    state[key] = value;
  }

  for (let i = 0; i < cycles; i++) {
    const newState = {};
    let newMins = [...min];
    let newMaxes = [...max];
    result = 0;
    const allCoordinates = getCoordinatesInRange(min, max);
    for (const coordinates of allCoordinates) {
      const cube = getCube(coordinates, state);
      let newCube = cube;
      const neighbors = getNeighbors(coordinates, state);
      const activeCount = count(active, neighbors);
      if (cube == inactive && activeCount == 3) {
        newCube = active;
      } else if (cube == active && activeCount !== 2 && activeCount !== 3) {
        newCube = inactive;
      }
      setCube(newCube, coordinates, newState);
      if (newCube == active) {
        result++;
        for (let j = 0; j < coordinates.length; j++) {
          newMins[j] = Math.min(newMins[j], coordinates[j] - 1);
          newMaxes[j] = Math.max(newMaxes[j], coordinates[j] + 1);
        }
      }
    }
    state = newState;
    min = newMins;
    max = newMaxes;
  }

  return result;
}