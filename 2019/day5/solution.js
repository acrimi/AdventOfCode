const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);
  let output = comp.execute(isPart2 ? 5 : 1);
  while (!output.done) {
    if (result != 0) {
      console.log('errorCode', result);
      return 0;
    }
    result = output.value;
    output = comp.execute();
  }

  return result;
}