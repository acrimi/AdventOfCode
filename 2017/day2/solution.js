module.exports = (input, isPart2, isTest) => {
  let result = 0;

  for (let row of input) {
    if (!isPart2) {
      let min = Number.MAX_VALUE;
      let max = 0;
      for (let column of row) {
        min = Math.min(parseInt(column), min);
        max = Math.max(parseInt(column), max);
      }

      result += max - min;
    } else {
      for (let i = 0; i < row.length; i++) {
        for (let j = i+1; j < row.length; j++) {
          const int1 = parseInt(row[i]);
          const int2 = parseInt(row[j]);
          if (int1 % int2 == 0) {
            result += int1 / int2;
          } else if (int2 % int1 == 0) {
            result += int2 / int1;
          }
        }
      }
    }
  }

  return result;
}