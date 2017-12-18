module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let lastPlayed = 0;
  
  const processInput = (line, program, receiver) => {
    let waiting = false;
    let registers = program.registers;

    let [m, instruction, x, y] = line.match(/^(\w+) (\S+)(?: (\S+))?/);
    let value = isNaN(+y) ? registers[y] || 0 : +y;
    let xValue = isNaN(+x) ? registers[x] || 0 : +x; 
    switch (instruction) {
      case 'snd':
        if (!isPart2) {
          lastPlayed = xValue;
        } else {
          receiver.queue.push(xValue);
          result += program.id; // plus one if program 1 sends
        }
        break;
      case 'set':
        registers[x] = value;
        break;
      case 'add':
        registers[x] = (registers[x] || 0) + value;
        break;
      case 'mul':
        registers[x] = (registers[x] || 0) * value;
        break;
      case 'mod':
        registers[x] = (registers[x] || 0) % value;
        break;
      case 'rcv':
        if (!isPart2) {
          if (registers[x] !== 0) {
            result = lastPlayed;
          }
        } else {
          if (program.queue.length > 0) {
            registers[x] = program.queue.shift();
          } else {
            waiting = true;
          }
        }
        break;
      case 'jgz':
        if (xValue > 0) {
          program.index += value - 1;
        }
        break;
    }

    return !waiting;
  };

  if (!isPart2) {
    result = false;
    const program = {
      registers: {},
      queue: [],
      index: 0
    };

    while (program.index < input.length) {
      processInput(input[program.index], program);
      if (result !== false) {
        break;
      }
      program.index++;
    }
  } else {
    let program = {
      id: 0,
      registers: {p: 0},
      queue: [],
      index: 0
    };
    let receiver = {
      id: 1,
      registers: {p: 1},
      queue: [],
      index: 0
    };

    const switchProgram = () => {
      let tmp = program;
      program = receiver;
      receiver = tmp;
    };

    while (true) {
      if (program.index >= input.length || program.index < 0) {
        program.terminated = true;
        switchProgram();
      } else {
        if (processInput(input[program.index], program, receiver)) {
          program.waiting = false;
          program.index++;
        } else {
          program.waiting = true;
          switchProgram();
        }
      }

      if (((program.waiting && program.queue.length === 0) || program.terminated) &&
          ((receiver.waiting && receiver.queue.length === 0) || receiver.terminated)) {
        // deadlock
        break;
      }
    }
  }

  return result;
}