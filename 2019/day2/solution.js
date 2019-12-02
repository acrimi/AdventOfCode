module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const execute = (instructions, noun, verb) => {
    if (noun != null && verb != null) {
      instructions[1] = noun;
      instructions[2] = verb;
    }

    const stepSize = 4;
    const opcodes = {
      1: (position, instructions) => {
        let arg1 = instructions[position + 1];
        let arg2 = instructions[position + 2];
        let destination = instructions[position + 3];
        instructions[destination] = instructions[arg1] + instructions[arg2];
      },
      2: (position, instructions) => {
        let arg1 = instructions[position + 1];
        let arg2 = instructions[position + 2];
        let destination = instructions[position + 3];
        instructions[destination] = instructions[arg1] * instructions[arg2];
      },
      99: () => true
    };

    let position = 0;
    while (true) {
      const code = instructions[position];
      const fn = opcodes[code];
      if (!fn || fn(position, instructions)) {
        break;
      }
      position += stepSize;
    }

    return instructions[0];
  };

  
  if (!isPart2) {
    if (isTest) {
      result = execute(input.concat([]));
    } else {
      result = execute(input.concat([]), 12, 2);
    }
  } else if (isPart2) {
    for (let noun = 0; noun < 99; noun++) {
      for (let verb = 0; verb < 99; verb++) {
        if (execute(input.concat([]), noun, verb) === 19690720) {
          result = 100 * noun + verb;
        }
      }
    }
  }

  return result;
}