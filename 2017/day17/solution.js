module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const iterations = isPart2 ? 50000000 : 2017;
  const stepSize = +input;
  let buffer = [0];
  let currentValue = 0;
  let currentIndex = 0;

  while (currentValue < iterations) {
    currentIndex = (currentIndex + stepSize) % ++currentValue + 1;
    if (!isPart2) {
      buffer.splice(currentIndex, 0, currentValue);
    } else if (currentIndex === 1) {
      result = currentValue;
    }
  }

  if (!isPart2) {
    result = buffer[(currentIndex + 1) % buffer.length];
  }

  return result;
}