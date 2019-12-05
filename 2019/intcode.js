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
    state.memory[arg1] = state.input;
  },
  4: (state, modes) => {
    let arg1 = getArg(1, state, modes);
    state.output.push(arg1);
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
  99: () => true
};

module.exports.execute = (memory, noun, verb, input) => {
  memory = memory.concat([]);
  if (noun != null && verb != null) {
    memory[1] = noun;
    memory[2] = verb;
  }

  const state = {
    pointer: 0,
    memory: memory,
    input: input,
    output: []
  };

  while (true) {
    let code = '' + state.memory[state.pointer];
    const modes = code.substring(0, code.length - 2);
    code = +code.substr(code.length - 2);
    const fn = opcodes[code];
    if (!fn || fn(state, modes)) {
      break;
    }
    state.pointer += stepSizes[code];
  }

  return input ? state.output : state.memory[0];
}