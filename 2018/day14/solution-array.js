module.exports = (input, isPart2, isTest) => {
  let result = '';

  let targetRecipeCount = +input;
  let targetSequence = input;
  let targetRegex = new RegExp(targetSequence);

  let scores = [3, 7];
  let elfOne = 0;
  let elfTwo = 1;

  let scoreTail = '';
  while (scores.length < targetRecipeCount + 10 || isPart2) {
    let newScores = ((scores[elfOne] + scores[elfTwo]) + '').split('');
    for (let score of newScores) {
      scores.push(+score);

      if (!isPart2 && scores.length > targetRecipeCount) {
        result += score;
      }

      if (isPart2 && !result) {
        scoreTail += score;
        if (targetRegex.test(scoreTail)) {
          result = scores.length - targetSequence.length;
        } else if (scoreTail.length > targetSequence.length) {
          scoreTail = scoreTail.substring(scoreTail.length - targetSequence.length);
        }
      }
    };

    if (isPart2 && result) {
      break;
    }

    elfOne += scores[elfOne] + 1;
    elfOne %= scores.length;
    elfTwo += scores[elfTwo] + 1;
    elfTwo %= scores.length;
  }

  if (!isPart2) {
    result = result.substr(0, 10);
  }

  return result;
}