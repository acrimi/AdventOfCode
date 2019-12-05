const intcode = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const output = intcode.execute(input, null, null, isPart2 ? 5 : 1);
  for (let i = 0; i < output.length; i++) {
    const code = output[i];
    if (i != output.length - 1 && code != 0) {
      console.log('error');
      console.log(output);
      return 0;
    }
    result = code;
  }

  return result;
}