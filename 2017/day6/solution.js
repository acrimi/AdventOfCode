module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let banks = input.split(/\s+/).map(b => +b);

  let configurations = {};
  let cycles = 0;
  while (true) {
    const config = banks.join(',');
    if (configurations[config] != null) {
      if (isPart2) {
        result = cycles - configurations[config];
      }
      break;
    }
    configurations[config] = cycles;

    let blocks = 0;
    let index = -1;
    for (let i = 0; i < banks.length; i++) {
      if (banks[i] > blocks) {
        blocks = banks[i];
        index = i;
      }
    }

    banks[index] = 0;
    while (blocks > 0) {
      index++;
      index %= banks.length;
      banks[index]++;
      blocks--;
    }

    cycles++;
  }

  result = result || cycles;

  return result;
}