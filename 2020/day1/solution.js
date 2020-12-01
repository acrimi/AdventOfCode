module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const target = 2020;
  const map = {};
  input.forEach(amount => {
    map[amount] = true;
  })

  function findProduct(target, terms, skip) {
    for (let item of input) {
      if (item == skip) {
        continue;
      }
      const diff = target - item;
      if (terms == 2) {
        if (map[diff]) {
          return diff * item;
        }
      } else {
        const prod = findProduct(diff, terms - 1, item);
        if (prod) {
          return prod * item;
        }
      }
    }
  }

  result = findProduct(target, isPart2 ? 3 : 2);

  return result;
}