const AWAIT = 'await';
const EXIT = 'exit';

const getArg = (argNumber, state, modes) => {
  let arg = state.memory[state.pointer + argNumber];
  if (modes.length < argNumber || modes[modes.length - argNumber] == 0) {
    arg = state.memory[arg];
  }
  return arg;
};

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
  1: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    let destination = state.memory[state.pointer + 3];
    state.memory[destination] = arg1 + arg2;
  },
  2: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    let destination = state.memory[state.pointer + 3];
    state.memory[destination] = arg1 * arg2;
  },
  3: (state) => {
    let arg1 = state.memory[state.pointer + 1];
    if (state.inputs.length === 0) {
      return AWAIT;
    }
    state.memory[arg1] = state.inputs.shift();
  },
  4: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    state.output.push(arg1);
    return arg1;
  },
  5: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    if (arg1 != 0) {
      state.pointer = arg2 - stepSizes[5];
    }
  },
  6: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    if (arg1 == 0) {
      state.pointer = arg2 - stepSizes[6];
    }
  },
  7: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    let destination = state.memory[state.pointer + 3];
    state.memory[destination] = arg1 < arg2 ? 1 : 0;
  },
  8: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    let arg2 = getArg(2, state, modes);
    let destination = state.memory[state.pointer + 3];
    state.memory[destination] = arg1 == arg2 ? 1 : 0;
  },
  99: () => EXIT
};

function * execute(state) {
  while (true) {
    let code = '' + state.memory[state.pointer];
    const modes = code.substring(0, code.length - 2);
    code = +code.substr(code.length - 2);
    const fn = opcodes[code];
    if (!fn) {
      return;
    }
    const result = fn(state, modes);
    if (result === EXIT) {
      // console.log('exiting');
      return state.memory[0];
    } else if (result === AWAIT) {
      // console.log('awaiting');
      yield;
      continue;
    } else if (result != null) {
      // console.log('output', result);
      yield result;
    }
    state.pointer += stepSizes[code];
  }
}

class Computer {
  constructor(memory, noun, verb) {
    memory = memory.concat([]);
    if (noun != null && verb != null) {
      memory[1] = noun;
      memory[2] = verb;
    }
    this.state = {
      pointer: 0,
      memory: memory,
      inputs: [],
      output: []
    }

    this.loop = execute(this.state);
  }

  execute(input) {
    this.state.inputs = this.state.inputs.concat(input);
    return this.loop.next();
  }
}

module.exports = Computer;