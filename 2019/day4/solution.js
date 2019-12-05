module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const start = input[0];
  const end = input[1];
  const regex = isPart2 ? /(?:^|(\d)(?!\1))(\d)\2(?!\2)/ : /(\d)\1/;

  main:
  for (let i = start; i <= end; i++) {
    const str = i.toString();
    if (!regex.test(str)) {
      continue;
    }
    for (let j = 1; j < str.length; j++) {
      if (+str[j] < +str[j - 1]) {
        continue main;
      }
    }
    result++;
  }

  return result;
}