const AWAIT = 'await';
const EXIT = 'exit';

const getPosition = (argNumber, state, modes) => {
  let arg = state.memory[state.pointer + argNumber];
  if (modes.length < argNumber || modes[modes.length - argNumber] == 0) {
    return arg;
  } else if (modes[modes.length - argNumber] == 2) {
    return arg + state.relativeBase;
  }
  return state.pointer + argNumber;
}

const getArg = (argNumber, state, modes) => {
  const position = getPosition(argNumber, state, modes);
  state.memory[position] = state.memory[position] || 0;
  return state.memory[position];
};

const stepSizes = {
  1: 4,
  2: 4,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 2
};

const opcodes = {
  1: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    const destination = getPosition(3, state, modes);
    state.memory[destination] = arg1 + arg2;
  },
  2: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    const destination = getPosition(3, state, modes);
    state.memory[destination] = arg1 * arg2;
  },
  3: (state, modes) => {
    const position = getPosition(1, state, modes);
    if (state.inputs.length === 0) {
      return AWAIT;
    }
    state.memory[position] = state.inputs.shift();
  },
  4: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    state.output.push(arg1);
    return arg1;
  },
  5: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    if (arg1 != 0) {
      state.pointer = arg2 - stepSizes[5];
    }
  },
  6: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    if (arg1 == 0) {
      state.pointer = arg2 - stepSizes[6];
    }
  },
  7: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    const destination = getPosition(3, state, modes);
    state.memory[destination] = arg1 < arg2 ? 1 : 0;
  },
  8: (state, modes) => {
    const arg1 = getArg(1, state, modes);
    const arg2 = getArg(2, state, modes);
    const destination = getPosition(3, state, modes);
    state.memory[destination] = arg1 == arg2 ? 1 : 0;
  },
  9: (state, modes) => {
    const baseOffset = getArg(1, state, modes);
    state.relativeBase += baseOffset;
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
      return state.memory[0];
    } else if (result === AWAIT) {
      yield;
      continue;
    } else if (result != null) {
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
      relativeBase: 0,
      memory: memory,
      inputs: [],
      output: []
    }

    this.loop = execute(this.state);
  }

  reset(memory) {
    this.state.pointer = 0;
    this.state.relativeBase = 0;
    this.state.memory = memory.concat([]);
    this.state.inputs = [];
    this.state.output = [];
    this.loop = execute(this.state);
  }

  execute(input, continuous) {
    this.pushInput(input);
    if (!continuous) {
      return this.loop.next();
    } else {
      const newOutputs = [];
      let output;
      do {
        if (output) {
          newOutputs.push(output.value);
        }
        output = this.loop.next();
      } while (output.value != null && !output.done);
      output.value = newOutputs;
      return output;
    }
  }

  pushInput(input) {
    if (input != null) {
      this.state.inputs = this.state.inputs.concat(input);
    }
  }

  getOutputs() {
    return this.state.output;
  }
}

module.exports = Computer;