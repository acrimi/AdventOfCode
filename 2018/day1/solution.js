module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let changes = isTest ? input.split(', ') : input;
  let frequencies = {};
  frequencies[result] = 1;

  do {
    for (let change of changes) {
      change = +(change.trim());
      result += change;
      frequencies[result] = (frequencies[result] || 0) + 1;
      if (isPart2 && frequencies[result] === 2) {
        return result;
      }
    }
  } while (isPart2)

  return result;
}