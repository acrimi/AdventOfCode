const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);
  let inputVal = isTest ? null : isPart2 ? 2 : 1;
  comp.execute(inputVal, true);

  const outputs = comp.getOutputs();
  if (!isTest && outputs.length > 1) {
    throw new Error('too many outputs');
  }
  result = testNumber == 1 ? outputs.join(',') : outputs.pop();

  return result;
}