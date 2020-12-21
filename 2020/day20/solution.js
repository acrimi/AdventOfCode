module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const directions = {
    left: {
      ltr: false,
      index: 0,
      offset: {
        x: -1,
        y: 0
      }
    },
    top: {
      ltr: true,
      index: 1,
      offset: {
        x: 0,
        y: -1
      }
    },
    right: {
      ltr: true,
      index: 2,
      offset: {
        x: 1,
        y: 0
      }
    },
    bottom: {
      ltr: false,
      index: 3,
      offset: {
        x: 0,
        y: 1
      }
    }
  };

  const tiles = [];
  const placedTiles = [];
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  
  let tile = {
    image: [],
    border: {}
  };
  input.push('');
  for (const line of input) {
    if (line.length == 0) {
      tile.border.left = tile.image.map(r => r[0]).join('');
      tile.border.right = tile.image.map(r => r[r.length - 1]).join('');
      tile.border.top = tile.image.shift();
      tile.border.bottom = tile.image.pop();
      tile.image = tile.image.map(r => {
        const arr = r.split('');
        arr.shift();
        arr.pop();
        return arr;
      });
      tiles.push(tile);
      tile = {
        image: [],
        border: {}
      };
    } else if (line.startsWith('Tile')) {
      tile.id = +(line.match(/\d+/)[0]);
    } else {
      tile.image.push(line);
    }
  }

  function reverse(str) {
    return str.split('').reverse().join('');
  }

  function mirror(direction) {
    const index = (directions[direction].index + 2) % 4;
    for (const mirror in directions) {
      if (directions[mirror].index == index) {
        return mirror;
      }
    }
  }

  function rotateArray(arr, rotations) {
    if (rotations == 0) {
      return arr;
    }
    const newArr = [];
    const len = rotations == 2 ? arr.length : arr[0].length;
    for (let i = 0; i < len; i++) {
      newArr.push([]);
    }
    const midX = (arr[0].length - 1) / 2;
    const midY = (arr.length - 1) / 2;
    for (let y = 0; y < arr.length; y++) {
      const row = arr[y];
      for (let x = 0; x < row.length; x++) {
        let newX;
        let newY;
        if (rotations == 1) {
          newY = x;
          newX = midY + (midY - y);
        } else if (rotations == 2) {
          newY = midY + (midY - y);
          newX = midX + (midX - x);
        } else {
          newY = midX + (midX - x);
          newX = y;
        }
        newArr[newY][newX] = row[x];
      }
    }
    return newArr;
  }

  function transformTile(tile, edge, destination, reversed) {
    let rotations = directions[destination].index + 6 - directions[edge].index;
    const flip = directions[edge].ltr == directions[destination].ltr ^ reversed;
    if (flip) {
      const left = tile.border.left;
      tile.border.left = tile.border.right;
      tile.border.right = left;
      tile.border.top = reverse(tile.border.top);
      tile.border.bottom = reverse(tile.border.bottom);
      if (edge == 'left' || edge == 'right') {
        rotations += 2;
      }
      tile.image.forEach(r => r.reverse());
    }
    rotations %= 4;
    for (let i = 0; i < rotations; i++) {
      const left = tile.border.left;
      tile.border.left = tile.border.bottom;
      tile.border.bottom = reverse(tile.border.right);
      tile.border.right = tile.border.top;
      tile.border.top = reverse(left);
    }
    tile.image = rotateArray(tile.image, rotations);
  }

  function placeTile(tile) {
    for (const d1 in tile.border) {
      const line = tile.border[d1];
      const lineReversed = reverse(line);
      for (const placed of placedTiles) {
        for (const d2 in placed.border) {
          if (placed[d2] != null) {
            // already matched
            continue;
          }
          const placedLine = placed.border[d2];
          if (line == placedLine || lineReversed == placedLine) {
            transformTile(tile, d1, d2, lineReversed == placedLine);
            placed[d2] = tile;
            tile[mirror(d2)] = placed;
            placedTiles.push(tile);
            tile.position = {
              x: placed.position.x + directions[d2].offset.x,
              y: placed.position.y + directions[d2].offset.y,
            };
            minX = Math.min(minX, tile.position.x);
            maxX = Math.max(maxX, tile.position.x);
            minY = Math.min(minY, tile.position.y);
            maxY = Math.max(maxY, tile.position.y);
            return true;
          }
        }
      }
    }
    return false;
  }

  function getComposite() {
    const composite = [];
    const length = Math.sqrt(placedTiles.length);
    for (let i = 0; i < length; i++) {
      composite.push([]);
    }
    const offsetX = -minX;
    const offsetY = -minY;
    for (const tile of placedTiles) {
      composite[tile.position.y + offsetY][tile.position.x + offsetX] = tile.image;
    }
    
    return composite.flatMap(r => r.reduce((acc, t) => {
      for (let i = 0; i < t.length; i++) {
        acc[i].push(...t[i]);
      }
      return acc;
    }));
  }

  function checkPattern(pattern, source, offsetX, offsetY) {
    for (let index of pattern) {
      if (index.y + offsetY >= source.length) {
        return false;
      }
      const row = source[index.y + offsetY];
      if (index.x + offsetX >= row.length) {
        return false;
      }
      const symbol = row[index.x + offsetX];
      if (symbol != '#' && symbol != 'O') {
        return false;
      }
    }

    for (let index of pattern) {
      source[index.y + offsetY][index.x + offsetX] = '0';
    }

    return true;
  }

  function markMonsters(image) {
    let basePattern = '                  # \n#    ##    ##    ###\n #  #  #  #  #  #   '.split('\n').map(r => r.split(''));
    const patterns = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const indexes = [];
        for (let y = 0; y < basePattern.length; y++) {
          for (let x = 0; x < basePattern[y].length; x++) {
            if (basePattern[y][x] == '#') {
              indexes.push({ x, y });
            }
          }
        }
        patterns.push(indexes);
        basePattern = rotateArray(basePattern, 1);
      }
      basePattern.forEach(r => r.reverse());
    }

    let orientedPattern;
    for (let y = 0; y < image.length; y++) {
      for (let x = 0; x < image[y].length; x++) {
        if (orientedPattern) {
          checkPattern(orientedPattern, image, x, y)
        } else {
          for (const pattern of patterns) {
            if (checkPattern(pattern, image, x, y)) {
              orientedPattern = pattern;
              break;
            }
          }
        }
      }
    }
  }

  placedTiles.push(tiles.shift());
  placedTiles[0].position = { x: 0, y: 0 };
  while (tiles.length > 0) {
    const tile = tiles.shift();
    if (!placeTile(tile)) {
      tiles.push(tile);
    }
  }

  if (!isPart2) {
    result = placedTiles
      .filter(t => (t.position.x == minX || t.position.x == maxX) && (t.position.y == minY || t.position.y == maxY))
      .reduce((acc, t) => acc * t.id, 1);
  } else {
    const composite = getComposite();
    markMonsters(composite);
    composite.forEach(r => r.forEach(p => { 
      if (p == '#') result++;
    }));
  }

  return result;
}