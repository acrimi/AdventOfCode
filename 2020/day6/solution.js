module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  for (const group of [].concat(input)) {
    const allAnswers = group.replace(/\n/g, '').split('').sort().join('');
    if (isPart2) {
      const members = group.split('\n');
      if (members.length == 1) {
        result += members[0].length;
      } else {
        allAnswers.replace(new RegExp(`([a-z])\\1{${members.length - 1}}`, 'g'), () => result++);
      }
    } else {
      const answers = allAnswers.replace(/([a-z])\1+/g, '$1')
      result += answers.length;
    }
  }

  return result;
}