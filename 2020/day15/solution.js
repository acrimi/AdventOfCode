module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const target = isPart2 ? 30000000 : 2020;
  const indexes = {};
  let previous = input.pop();
  input.forEach((n, i) => indexes[n] = i);
  for (let i = input.length; i < target - 1; i++) {
    const lastIndex = indexes[previous];
    indexes[previous] = i;
    if (lastIndex == null) {
      previous = 0;
    } else {
      previous = i - lastIndex;
    }
  }
  result = previous;

  return result;
}