module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const width = isTest ? 2 : 25;
  const height = isTest ? 2 : 6;
  const layers = [];

  const length = width * height;
  let start = 0;
  let fewestZeroes;
  let ones;
  let twos;
  while (start <= input.length - length) {
    const layerStr = input.substring(start, start + length);
    if (!isPart2) {
      const zeroes = layerStr.match(/0/g).length;
      if (fewestZeroes == null || zeroes < fewestZeroes) {
        fewestZeroes = zeroes;
        ones = layerStr.match(/1/g).length;
        twos = layerStr.match(/2/g).length;
      }
    } else {
      const layer = [];
      let row = 0;
      while (row <= layerStr.length - width) {
        const rowStr = layerStr.substring(row, row + width).split('').map(p => {
          if (p == 0) {
            return '-';
          } else if (p == 1) {
            return '0'
          } else if (p == 2) {
            return ' ';
          }
        }).join('');
        layer.push(rowStr);
        row += width;
      }
      layers.unshift(layer.join('\n'));
    }
    start += length;
  }

  if (isPart2) {
    let final = layers[0] + '';
    for (let i = 1; i < layers.length; i++) {
      const layer = layers[i];
      for (let j = 0; j < layer.length; j++) {
        const pixel = layer[j];
        if (pixel != ' ') {
          final = final.substring(0, j) + pixel + final.substring(j + 1);
        }
      }
    }

    const fs = require('fs');
    const file = isTest ? './test-out.txt' : 'out.txt';
    fs.writeFileSync(file, final);
  }

  result = ones * twos;

  return result;
}