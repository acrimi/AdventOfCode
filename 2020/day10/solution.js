module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  input = input.sort((a, b) => a - b);
  const maxDeviation = 3;
  const source = 0;
  const device = input[input.length - 1] + 3;

  if (!isPart2) {
    let currentRating = source;
    let diffsOf1 = 0;
    let diffsOf3 = 1;
    for (const adapter of input) {
      const diff = adapter - currentRating;
      if (diff == 1) {
        diffsOf1++;
      } else if (diff == 3) {
        diffsOf3++;
      }
      currentRating = adapter;
    }

    result = diffsOf1 * diffsOf3;
  } else {
    const map = {
      [source]: 1
    };
    input.push(device);
    for (const adapter of input) {
      let roots = 0;
      const minConnection = adapter - maxDeviation;
      for (let i = minConnection; i < adapter; i++) {
        if (map[i]) {
          roots += map[i];
        }
      }
      map[adapter] = roots;
    }
    
    result = map[device];
  }

  return result;
}