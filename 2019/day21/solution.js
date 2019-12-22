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
    instructions =
      `NOT A J
      NOT C T
      AND D T
      OR T J
      WALK
      `;
  } else {
    // if !A || (!(B && C) && D && (E || H)
    instructions =
      `OR B T
      AND C T
      NOT T T
      AND D T
      OR E J
      OR H J
      AND J T
      NOT A J
      OR T J
      RUN
      `;
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