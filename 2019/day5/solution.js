module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const machineInput = isPart2 ? 5 : 1;
  const outputs = [];
  const execute = (instructions, noun, verb) => {
    if (noun != null && verb != null) {
      instructions[1] = noun;
      instructions[2] = verb;
    }

    let pointer = 0;

    const getArg = (argNumber, position, instructions, modes) => {
      let arg = instructions[position + argNumber];
      if (modes.length < argNumber || modes[modes.length - argNumber] == 0) {
        arg = instructions[arg];
      }
      return arg;
    }
    const stepSizes = {
      1: 4,
      2: 4,
      3: 2,
      4: 2,
      5: 3,
      6: 3,
      7: 4,
      8: 4
    };
    const opcodes = {
      1: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        let destination = instructions[position + 3];
        instructions[destination] = arg1 + arg2;
      },
      2: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        let destination = instructions[position + 3];
        instructions[destination] = arg1 * arg2;
      },
      3: (position, instructions) => {
        let arg1 = instructions[position + 1];
        instructions[arg1] = machineInput;
      },
      4: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        outputs.push(arg1);
      },
      5: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        if (arg1 != 0) {
          pointer = arg2 - stepSizes[5];
        }
      },
      6: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        if (arg1 == 0) {
          pointer = arg2 - stepSizes[6];
        }
      },
      7: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        let destination = instructions[position + 3];
        instructions[destination] = arg1 < arg2 ? 1 : 0;
      },
      8: (position, instructions, modes) => {
        let arg1 = getArg(1, position, instructions, modes);
        let arg2 = getArg(2, position, instructions, modes);
        let destination = instructions[position + 3];
        instructions[destination] = arg1 == arg2 ? 1 : 0;
      },
      99: () => true
    };

    while (true) {
      let code = '' + instructions[pointer];
      const modes = code.substring(0, code.length - 2);
      code = +code.substr(code.length - 2);
      const fn = opcodes[code];
      if (!fn || fn(pointer, instructions, modes)) {
        break;
      }
      pointer += stepSizes[code];
    }

    return instructions[0];
  };

  execute(input.concat([]));
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    if (i != outputs.length - 1 && output != 0) {
      console.log('error');
      console.log(outputs);
      return 0;
    }
    result = output;
  }

  return result;
}