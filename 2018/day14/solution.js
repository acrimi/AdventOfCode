module.exports = (input, isPart2, isTest) => {
  let result = '';

  let targetRecipeCount = +input;
  let targetSequence = input;
  let targetRegex = new RegExp(targetSequence);

  let elfOne = {
    score: 3
  };
  let elfTwo = {
    score: 7
  };
  elfOne.next = elfOne.prev = elfTwo;
  elfTwo.next = elfTwo.prev = elfOne;

  let first = elfOne;
  let last = elfTwo;
  let recipes = 2;

  let scoreTail = '';
  while (recipes < targetRecipeCount + 10 || isPart2) {
    let newScores = ((elfOne.score + elfTwo.score) + '').split('');
    let prevScore;
    newScores = newScores.map(score => {
      let obj = {
        score: +score
      }
      if (prevScore) {
        prevScore.next = obj;
        obj.prev = prevScore;
      }
      prevScore = obj;
      recipes++;
      if (!isPart2 && recipes > targetRecipeCount) {
        result += score;
      }

      if (isPart2 && !result) {
        scoreTail += score;
        if (targetRegex.test(scoreTail)) {
          result = recipes - targetSequence.length;
        } else if (scoreTail.length > targetSequence.length) {
          scoreTail = scoreTail.substring(scoreTail.length - targetSequence.length);
        }
      }
      
      return obj;
    });

    if (result) {
      break;
    }

    last.next = newScores[0];
    newScores[0].prev = last;
    last = newScores[newScores.length - 1];
    last.next = first;

    let offsetOne = elfOne.score + 1;
    while (offsetOne > 0) {
      elfOne = elfOne.next;
      offsetOne--;
    }

    let offsetTwo = elfTwo.score + 1;
    while (offsetTwo > 0) {
      elfTwo = elfTwo.next;
      offsetTwo--;
    }
  }

  if (!isPart2) {
    result = result.substr(0, 10);
  }

  return result;
}