module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const terminators = new Set();

  let two = 0;
  while (true) {
    let five = two | 65536;
    two = 16123384;
    while (true) {
      two += (five & 255);
      two &= 16777215;
      two *= 65899;
      two &= 16777215;
      
      if (five < 256) {
        break;
      }

      five = Math.floor(five / 256);
    }

    if (!isPart2 && two >= 0) {
      result = two;
      break;
    } else if (isPart2 && !terminators.has(two)) {
      console.log(two);
    }

    terminators.add(two);
  }

  return result;
}