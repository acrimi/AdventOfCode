module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const phases = testNumber === 1 ? 4 : 100;
  const sequence = [0, 1, 0, -1];

  const fft = (inputArr) => {
    const output = [];
    for (let i = 0; i < inputArr.length; i++) {
      const repetitions = i + 1;
      let element = 0;
      for (let j = 0; j < inputArr.length; j++) {
        let sequenceIndex = Math.floor((j + 1) / repetitions) % sequence.length;
        element += inputArr[j] * sequence[sequenceIndex];
      }
      output.push(+('' + element).split('').pop());
    }
    return output;
  };

  for (let i = 0; i < phases; i++) {
    input = fft(input);
  }
  result = input.join('').substring(0, 8);

  return result;
}