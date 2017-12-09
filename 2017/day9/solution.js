module.exports = (input, isPart2, isTest) => {
  let result = 0;

  input = input.replace(/!./g, '').replace(/<([^>]*)>/g, (match, garbage) => {
    if (isPart2 && garbage) {
      result += garbage.length;
    }

    return '';
  });
  
  if (!isPart2) {
    let depth = 0;
    for (let char of input) {
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        result += depth;
        depth--;
      }
    }
  }

  return result;
}