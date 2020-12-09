module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const preambleLength = isTest ? 5 : 25;
  const addends = input.slice(0, preambleLength).map(i => +i);

  function isValidEntry(number) {
    for (const addend of addends) {
      if (addend == number / 2) {
        continue;
      }
      const complement = number - addend;
      if (addends.includes(complement)) {
        return true;
      }
    }
    return false;
  }

  for (let i = preambleLength; i < input.length; i++) {
    const val = +input[i];
    if (!isValidEntry(val)) {
      result = val;
      break;
    }
    addends.shift();
    addends.push(val);
  }

  if (isPart2) {
    let sum = 0;
    const set = [];
    for (const val of input) {
      sum += +val;
      set.push(+val);
      while (sum > result) {
        sum -= set.shift();
      }
      if (sum == result) {
        set.sort();
        result = set[0] + set[set.length - 1];
        break;
      }
    }
  }

  return result;
}