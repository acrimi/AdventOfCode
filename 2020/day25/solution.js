module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const initialSubject = 7;
  const divisor = 20201227;
  const cardKey = +input[0];
  const doorKey = +input[1];
  let cardLoop = 0;

  let value = 1;
  while (value != cardKey) {
    value *= initialSubject;
    value = value % divisor;
    cardLoop++;
  }

  result = 1;
  for (let i = 0; i < cardLoop; i++) {
    result *= doorKey;
    result = result % divisor;
  }

  return result;
}