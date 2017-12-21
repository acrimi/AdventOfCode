module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const rules = {};
  const iterations = isTest ? 2 : (isPart2 ? 18 : 5);
  let grid = `.#./..#/###`;

  const flipGridHorizontal = (grid) => {
    let rows = grid.split('/').map(r => r.split('').reverse().join(''));
    return rows.join('/');
  };

  const flipGridVertical = (grid) => {
    return grid.split('/').reverse().join('/');
  };

  const rotateGrid = (grid) => {
    let rows = grid.split('/');
    let newRows = [];
    for (let row of rows) {
      for (let i = 0; i < row.length; i++) {
        newRows[i] = row[i] + (newRows[i] || '');
      }
    }
    return newRows.join('/');
  };

  for (let line of input) {
    let [m, input, output] = line.match(/(\S+) => (\S+)/);
    rules[input] = output;
    rules[flipGridHorizontal(input)] = output;

    input = rotateGrid(input);
    rules[input] = output;
    input = rotateGrid(input);
    rules[input] = output;
    input = rotateGrid(input);
    rules[input] = output;
    
    input = rotateGrid(input);
    input = flipGridVertical(input);
    rules[input] = output;
    input = rotateGrid(input);
    rules[input] = output;
    input = rotateGrid(input);
    rules[input] = output;
    input = rotateGrid(input);
    rules[input] = output;
  }

  const getEnhancement = (grid) => {
    return rules[grid];
  };

  const processGrid = () => {
    let rows = grid.split('/');
    let newRows = [];
    let size = 3;
    if (rows.length % 2 === 0) {
      size = 2;
    }

    let count = rows.length / size;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        let cell = [];
        for (let y = 0; y < size; y++) {
          let row = rows[y + i*size];
          let str = '';
          for (let x = 0; x < size; x++) {
            str += row[x + j*size];
          }
          cell.push(str);
        }
        
        cell = getEnhancement(cell.join('/'));
        let subRows = cell.split('/');
        let newSize = subRows.length;
        for (let a = 0; a < subRows.length; a++) {
          let rowIndex = a + i*newSize;
          newRows[rowIndex] = (newRows[rowIndex] || '') + subRows[a];
        }
      }
    }

    grid = newRows.join('/');
  };

  for (let i = 0; i < iterations; i++) {
    processGrid();
  }

  result = grid.replace(/[^#]/g, '').length;

  return result;
}