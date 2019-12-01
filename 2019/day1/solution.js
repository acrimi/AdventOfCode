module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  input = isTest ? [input] : input;
  for (let mass of input) {
    while (mass > 0) {
      let fuel = Math.floor((+mass) / 3) - 2;
      if (fuel > 0) {
        result += fuel;
      }
      mass = isPart2 ? fuel : 0;
    }
  }

  return result;
}