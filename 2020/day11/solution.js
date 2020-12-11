module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const empty = 'L';
  const occupied = '#';
  const floor = '.';
  const occupiedThreshold = isPart2 ? 5 : 4;
  const states = {};

  function getNextSeat(x, y, dx, dy, state) {
    let x2 = x + dx;
    let y2 = y + dy;
    while (y2 >= 0 && y2 < state.length && x2 >= 0 && x2 < state[y2].length) {
      if (state[y2][x2] !== floor) {
        return state[y2][x2];
      }
      x2 += dx;
      y2 += dy;
    }
  }

  function getAdjacentSeats(x, y, state) {
    const seats = [];
    if (!isPart2) {
      for (let y2 = Math.max(0, y - 1); y2 < state.length && y2 <= y + 1; y2++) {
        const row = state[y2];
        for (let x2 = Math.max(0, x - 1); x2 < row.length && x2 <= x + 1; x2++) {
          if (y2 == y && x2 == x) {
            continue;
          }
          seats.push(row[x2]);
        }
      }
    } else {
      seats.push(getNextSeat(x, y, -1, 0, state));
      seats.push(getNextSeat(x, y, -1, 1, state));
      seats.push(getNextSeat(x, y, -1, -1, state));
      seats.push(getNextSeat(x, y, 1, 0, state));
      seats.push(getNextSeat(x, y, 1, 1, state));
      seats.push(getNextSeat(x, y, 1, -1, state));
      seats.push(getNextSeat(x, y, 0, 1, state));
      seats.push(getNextSeat(x, y, -0, -1, state));
    }
    return seats.filter(s => !!s);
  }

  function countMembers(arr, target) {
    let count = 0;
    for (const item of arr) {
      if (item == target) {
        count++;
      } 
    }
    return count;
  }

  let currentState = input;
  do {
    states[currentState] = true;
    const nextState = [];
    let occupancy = 0;
    for (let y = 0; y < currentState.length; y++) {
      const row = currentState[y];
      const nextRow = [];
      for (let x = 0; x < row.length; x++) {
        const seat = row[x];
        let newSeat = seat;
        const adjacentSeats = getAdjacentSeats(x, y, currentState);
        if (seat == empty && !adjacentSeats.includes(occupied)) {
          newSeat = occupied;
        } else if (seat == occupied && countMembers(adjacentSeats, occupied) >= occupiedThreshold) {
          newSeat = empty;
        }
        nextRow.push(newSeat);
        if (newSeat === occupied) {
          occupancy++;
        }
      }
      nextState.push(nextRow);
    }
    currentState = nextState;
    result = occupancy;
  } while (!states[currentState])

  return result;
}