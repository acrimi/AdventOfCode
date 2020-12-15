module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  input = input.reverse();
  const target = isPart2 ? 30000000 : 2020;
  for (let i = input.length; i < target; i++) {
    const previous = input[0];
    const lastIndex = input.indexOf(previous, 1);
    if (lastIndex == -1) {
      input.unshift(0);
    } else {
      input.unshift(lastIndex);
    }
  }
  result = input[0];

  return result;
}