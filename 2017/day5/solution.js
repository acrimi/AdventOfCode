module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let position = 0;

  while (position >= 0 && position < input.length) {
    let oldPosition = position;
    let offset = parseInt(input[position]);
    position += offset;
    if (isPart2 && offset >= 3) {
      input[oldPosition]--;
    } else {
      input[oldPosition]++;
    }
    result++;
  }

  return result;
}