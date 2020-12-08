module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const potentials = [];
  function run(scan, target) {
    const executedOperations = [];
    let accumulator = 0;
    let index = 0;
    const operations = {
      acc: value => accumulator += value,
      jmp: value => index += (value - 1),
      nop: () => {}
    };

    while (!executedOperations.includes(index)) {
      if (index == input.length) {
        return accumulator;
      }
      let [_, op, val] = input[index].match(/(\w+) (.*)/) || [];
      if (op == 'jmp' || op == 'nop') {
        if (scan) { 
          potentials.push(index);
        } else if (target === index) {
          op = op == 'jmp' ? 'nop' : 'jmp';
        }
      }
      executedOperations.push(index);
      operations[op](+val);
      index++;
    }
    if (!isPart2) {
      return accumulator;
    }
  }
  
  if (!isPart2) {
    result = run();
  } else {
    run(true);
    for (const potential of potentials) {
      const acc = run(false, potential);
      if (acc != null) {
        result = acc;
        break;
      }
    }
  }

  return result;
}