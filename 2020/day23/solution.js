module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const moves = isPart2 ? 10000000 : 100;
  const sorted = [...input].sort((a, b) => a - b);
  const min = sorted.shift();
  const max = sorted.pop();
  for (let i = max + 1; i <= 1000000; i++) {
    input.push(i);
  }

  let currentIndex = 0;
  for (let i = 0; i < moves; i++) {
    const currentCup = input[currentIndex];
    const removed = input.splice(currentIndex + 1, 3);
    removed.push(...input.splice(0, 3 - removed.length));
    let insertion;
    let targetValue = currentCup - 1;
    do {
      insertion = input.indexOf(targetValue);
      targetValue--;
      if (targetValue < min) {
        targetValue = max;
      }
    } while (insertion == -1)
    input.splice(insertion + 1, 0, ...removed);
    currentIndex = input.indexOf(currentCup) + 1;
    currentIndex %= input.length;
  }

  const oneIndex = input.indexOf(1);
  if (!isPart2) {
    result = input.slice(oneIndex + 1).concat(input.slice(0, oneIndex)).join('');
  } else {
    input.push(input.shift(), input.shift());
    result = input[oneIndex + 1] * input[oneIndex + 2];
  }

  return result;
}