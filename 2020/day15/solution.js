module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const target = isPart2 ? 30000000 : 2020;
  const indexes = new Map();
  let next = input.pop();
  input.forEach((n, i) => indexes.set(n, i));
  for (let i = input.length; i < target - 1; i++) {
    const lastIndex = indexes.get(next);
    indexes.set(next, i);
    if (lastIndex == null) {
      next = 0;
    } else {
      next = i - lastIndex;
    }
  }
  result = next;

  return result;
}