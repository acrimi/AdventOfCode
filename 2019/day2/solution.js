const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  if (!isPart2) {
    if (isTest) {
      result = new IntcodeComputer(input).execute().value;
    } else {
      result = new IntcodeComputer(input, 12, 2).execute().value;
    }
  } else if (isPart2) {
    for (let noun = 0; noun < 99; noun++) {
      for (let verb = 0; verb < 99; verb++) {
        if (new IntcodeComputer(input, noun, verb).execute().value === 19690720) {
          result = 100 * noun + verb;
        }
      }
    }
  }

  return result;
}