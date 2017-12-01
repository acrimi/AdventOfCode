module.exports = (input, isPart2, isTest) => {
  let result = 0;

  for (let i = 0; i < input.length; i++) {
    let next = i + 1;
    if (isPart2) {
      next = i + input.length/2;
    }
    next %= input.length;
    
    if (input[i] === input[next]) {
      result += parseInt(input[i]);
    }
  }

  return result;
}