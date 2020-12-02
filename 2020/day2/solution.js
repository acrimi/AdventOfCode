module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  for (let row of input) {
    const [_, min, max, letter, password] = row.match(/(\d*)-(\d*) (\w): (\w+)/) || [];
    if (isPart2) {
      if (password[+min - 1] == letter ^ password[+max - 1] == letter) {
        result++;
      }
    } else {
      const count = (password.match(new RegExp(letter, 'g')) || []).length;
      if (count >= +min && count <= +max) {
        result++;
      }
    }
  }

  return result;
}