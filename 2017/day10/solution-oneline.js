/*
 * Mostly the same as the default solution, but the knot hash logic for
 * part 2 is a one-liner (and just flat out stupid)
*/
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

    let knotHash = list.join(',').split(/((?:[^,]+,){16})/).filter(str => str.length > 0)
      .map(str => ('0' + str.split(',').reduce((sum, i) => sum ^ (+i), 0).toString(16)).slice(-2)).join('');

    result = knotHash;
  }

  return result;
}