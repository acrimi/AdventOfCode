const intcode = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  if (!isPart2) {
    if (isTest) {
      result = intcode.execute(input);
    } else {
      result = intcode.execute(input, 12, 2);
    }
  } else if (isPart2) {
    for (let noun = 0; noun < 99; noun++) {
      for (let verb = 0; verb < 99; verb++) {
        if (intcode.execute(input, noun, verb) === 19690720) {
          result = 100 * noun + verb;
        }
      }
    }
  }

  return result;
}