module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  let [depth] = input[0].match(/(\d+)/);
  let [_, x, y] = input[1].match(/(-?\d+),(-?\d+)/);

  const rocky = 0;
  const wet = 1;
  const narrow = 2;
  depth = +depth;
  const target = {
    x: +x,
    y: +y
  };

  const geologicalIndexes = [];
  const erosionLevels = [];

  function getGeologicalIndex(x, y) {
    const row = geologicalIndexes[y] = geologicalIndexes[y] || [];
    if (!row[x]) {
      if (x === 0 && y === 0) {
        row[x] = 0;
      } else if (x === target.x && y === target.y) {
        row[x] = 0;
      } else if (y === 0) {
        row[x] = x * 16807;
      } else if (x === 0) {
        row[x] = y * 48271;
      } else {
        row[x] = getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);
      }
    }

    return row[x];
  }

  function getErosionLevel(x, y) {
    const row = erosionLevels[y] = erosionLevels[y] || [];
    if (!row[x]) {
      row[x] = (getGeologicalIndex(x, y) + depth) % 20183;
    }

    return row[x];
  }

  function getTerrainType(x, y) {
    return getErosionLevel(x, y) % 3;
  }

  if (!isPart2) {
    for (let y = 0; y <= target.y; y++) {
      for (let x = 0; x <= target.x; x++) {
        result += getTerrainType(x, y);
      }
    }
  } else {
    const gearLists = {
      [rocky]: ['torch', 'climbing'],
      [wet]: ['climbing', 'neither'],
      [narrow]: ['torch', 'neither'],
    };

    const positions = [{
      x: 0,
      y: 0,
      time: 0,
      distance: target.x + target.y,
      gear: 'torch'
    }];
    const visited = {
      0: {
        time: 0,
        gear: 'torch'
      }
    };

    function queuePosition(position) {
      let i = 0;
      for (; i < positions.length; i++) {
        if (positions[i].cost > position.cost) {
          break;
        }
      }
      positions.splice(i, 0, position);
    }

    while (positions.length) {
      const position = positions.shift();
      if (position.x === target.x && position.y === target.y) {
        result = position.time;
        if (isTest) {
          break;
        } else {
          console.log(result);
        }
      }

      const moves = [
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y - 1 }
      ];

      for (let move of moves) {
        const posKey = (move.x << 16) + move.y;
        if (move.x < 0 || move.y < 0 || move.x > target.x * 1.5 || move.y > target.y * 1.5) {
          continue;
        }

        move.distance = Math.abs(target.x - move.x) + Math.abs(target.y - move.y);
        move.time = position.time + 1;

        let currentGearList = gearLists[getTerrainType(position.x, position.y)];
        let gearList = gearLists[getTerrainType(move.x, move.y)];
        if (!gearList.includes(position.gear)) {
          move.time += 7;
          if (currentGearList.includes(gearList[0])) {
            move.gear = gearList[0];
          } else if (currentGearList.includes(gearList[1])) {
            move.gear = gearList[1];
          }
        } else {
          move.gear = position.gear;
        }

        if (move.x === target.x && move.y === target.y && move.gear !== 'torch') {
          move.time += 7;
        }
        
        if (visited[posKey]) {
          if (visited[posKey].gear === move.gear) {
            if (visited[posKey].time <= move.time) {
              continue;
            }
          } else if (visited[posKey].time + 7 <= move.time) {
            continue;
          }
        } else {
          visited[posKey] = {};
        }
        visited[posKey].time = move.time;
        visited[posKey].gear = move.gear;

        move.cost = move.time + move.distance;

        queuePosition(move);
      }
    }
  }

  return result;
}