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
        y: 1
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
        y: -1
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
      tile.border.top = tile.image[0];
      tile.border.bottom = tile.image[tile.image.length - 1];
      tile.border.left = tile.image.map(r => r[0]).join('');
      tile.border.right = tile.image.map(r => r[r.length - 1]).join('');
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
    }
    rotations %= 4;
    for (let i = 0; i < rotations; i++) {
      const left = tile.border.left;
      tile.border.left = tile.border.bottom;
      tile.border.bottom = reverse(tile.border.right);
      tile.border.right = tile.border.top;
      tile.border.top = reverse(left);
    }
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

  placedTiles.push(tiles.shift());
  placedTiles[0].position = { x: 0, y: 0 };
  while (tiles.length > 0) {
    const tile = tiles.shift();
    if (!placeTile(tile)) {
      tiles.push(tile);
    }
  }

  // for (const tile of placedTiles) {
  //   isTest && console.log(tile.id);
  //   for (const d in directions) {
  //     isTest && console.log('  ', d, tile[d] && tile[d].id);
  //   }
  // }

  result = placedTiles
    .filter(t => (t.position.x == minX || t.position.x == maxX) && (t.position.y == minY || t.position.y == maxY))
    .reduce((acc, t) => acc * t.id, 1);

  return result;
}