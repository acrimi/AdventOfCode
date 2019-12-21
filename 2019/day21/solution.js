const IntcodeComputer = require('../intcode');
const ascii = require('../ascii');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const comp = new IntcodeComputer(input);

  const prompt = comp.execute(null, true).value;
  console.log(ascii.fromAscii(prompt));

  let instructions;
  if (!isPart2) {
    // if !A || (!C && D)
    instructions = "NOT A J\nNOT C T\nAND D T\nOR T J\nWALK\n";
  } else {
    // if !A || (!(B && C) && D && (E || H)
    instructions = "OR B T\nAND C T\nNOT T T\nAND D T\nOR E J\nOR H J\nAND J T\nNOT A J\nOR T J\nRUN\n";
  }

  const state = comp.execute(ascii.toAscii(instructions), true).value;

  if (state[state.length - 1] > 127) {
    // success
    result = state.pop();
  } else if (state.length > 0) {
    // fell in hole
    console.log(ascii.fromAscii(state));
  }

  return result;
}