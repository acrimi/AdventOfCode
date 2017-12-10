module.exports = (input, isPart2, isTest) => {
  let result = 0;
  
  if (!isPart2) {
    input = input.split(/\s?,\s?/);
  } else {
    input = input.split('').map(i => i.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
  }

  let listSize = isTest && !isPart2 ? 5 : 256;
  let list = [];
  for (let i = 0; i < listSize; i++) {
    list.push(i);
  }

  let currentPosition = 0;
  let skipSize = 0;
  const processInput = () => {
    for (let length of input) {
      length = +length;
      let sublist = list.splice(currentPosition, length);
      let wrapCount = length - sublist.length;
      if (wrapCount > 0) {
        sublist = sublist.concat(list.splice(0, wrapCount));
      }

      sublist.reverse();

      if (wrapCount > 0) {
        list.unshift(...sublist.splice(-wrapCount));
      }
      list.splice(currentPosition, 0, ...sublist);

      currentPosition += length + skipSize;
      currentPosition %= list.length;
      skipSize++;
    }
  }

  if (!isPart2) {
    processInput();
    result = list[0] * list[1];
  } else {
    for (let i = 0; i < 64; i++) {
      processInput();
    }

    let knotHash = '';
    while (list.length > 0) {
      let word = list.splice(0, 16);
      let hex = word.reduce((sum, i) => {
        return sum ^ i;
      }, 0).toString(16);

      if (hex.length === 1) {
        hex = '0' + hex;
      }

      knotHash += hex;
    }

    result = knotHash;
  }

  return result;
}