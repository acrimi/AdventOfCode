module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const minutes = isPart2 ? 1000000000 : 10;
  const open = '.';
  const trees = '|';
  const lumberyard = '#';
  let plot = input.map(row => row.split(''));

  function processOpenAcre(x, y) {
    let treeCount = 0;
    for (let scanX = x - 1; scanX <= x + 1; scanX++) {
      for (let scanY = y - 1; scanY <= y + 1; scanY++) {
        if ((scanX === x && scanY === y) || scanY < 0 || scanY >= plot.length || scanX < 0 || scanX >= plot[scanY].length) {
          continue;
        }

        if (plot[scanY][scanX] === trees) {
          treeCount++;
        }
      }
    }

    return treeCount >= 3 ? trees : open;
  }

  function processTrees(x, y) {
    let yardCount = 0;
    for (let scanX = x - 1; scanX <= x + 1; scanX++) {
      for (let scanY = y - 1; scanY <= y + 1; scanY++) {
        if ((scanX === x && scanY === y) || scanY < 0 || scanY >= plot.length || scanX < 0 || scanX >= plot[scanY].length) {
          continue;
        }

        if (plot[scanY][scanX] === lumberyard) {
          yardCount++;
        }
      }
    }

    return yardCount >= 3 ? lumberyard : trees;
  }

  function processLumberyard(x, y) {
    let yardCount = 0;
    let treeCount = 0;
    for (let scanX = x - 1; scanX <= x + 1; scanX++) {
      for (let scanY = y - 1; scanY <= y + 1; scanY++) {
        if ((scanX === x && scanY === y) || scanY < 0 || scanY >= plot.length || scanX < 0 || scanX >= plot[scanY].length) {
          continue;
        }

        if (plot[scanY][scanX] === lumberyard) {
          yardCount++;
        }
        if (plot[scanY][scanX] === trees) {
          treeCount++;
        }
      }
    }

    return yardCount >= 1 && treeCount >= 1 ? lumberyard : open;
  }

  function processAcre(type, x, y) {
    switch (type) {
      case open:
        return processOpenAcre(x, y);
      case trees:
        return processTrees(x, y);
      case lumberyard:
        return processLumberyard(x, y);
    }
  }

  let elapsedTime = 0;
  let pattern;
  let patternStart;
  let scores = [];
  while (elapsedTime++ < minutes) {
    let yardCount = 0;
    let treeCount = 0;
    plot = plot.map((row, y) => row.map((acre, x) => {
      let newAcre = processAcre(acre, x, y);
      if (newAcre === lumberyard) {
        yardCount++;
      } else if (newAcre === trees) {
        treeCount++;
      }
      return newAcre;
    }));

    let score = treeCount * yardCount;
    if (!pattern) {
      let index = scores.indexOf(score);
      if (index >= 0) {
        scores.splice(0, index);
        pattern = scores;
        patternStart = elapsedTime;
        scores = [];
      }
    } else {
      if (pattern[scores.length] !== score) {
        pattern = null;
      } else if (pattern.length === scores.length + 1) {
        break;
      }
    }
    scores.push(score);
  }
  
  if (pattern) {
    let dif = minutes - patternStart;
    dif %= pattern.length;
    result = pattern[dif];
  } else {
    result = scores.pop();
  }

  return result;
}