function sine(radians) {
  if (radians % Math.PI === 0) {
    return 0;
  }
  return Math.sin(radians);
}

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const outputLength = input.length * (isPart2 ? 10000 : 1);
  const phases = testNumber === 1 && !isPart2 ? 4 : 100;
  const sequence = [0, 1, 0, -1];
  const messageOffset = isPart2 ? +input.slice(0, 7).join('') : 0;

  const fft = (source) => {
    const output = [];
    for (let i = 0; i < outputLength; i++) {
      const periodScalar = i + 1;
      let element = 0;
      for (let j = i; j < outputLength; j += periodScalar * 2) {
        for (let k = j; k < j + periodScalar && k < outputLength; k++) {
          const sequenceIndex = Math.floor((k + 1) / periodScalar) % sequence.length;
          element += source[k % source.length] * sequence[sequenceIndex];
        }
      }
      output[i] = Math.abs(element) % 10;
    }
    return output;
  };

  if (!isPart2) {
    for (let i = 0; i < phases; i++) {
      input = fft(input);
    }
  } else {
    const originalLength = input.length;
    let sum = 0;
    let signal = [];
    for (let i = messageOffset; i < outputLength; i++) {
      const val = input[i % originalLength];
      signal.push(val);
      sum += val;
    }
    for (let p = 0; p < phases; p++) {
      let newSum = 0;
      for (let i = 0; i < outputLength - messageOffset; i++) {
        const val = sum % 10;
        sum -= signal[i];
        signal[i] = val;
        newSum += val;
      }
      sum = newSum;
    }
    input = signal;
  }
  result = input.slice(0, 8).join('');

  return result;
}