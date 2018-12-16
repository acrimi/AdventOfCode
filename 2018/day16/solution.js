module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const addr = (registers, a, b, c) => {
    registers[c] = registers[a] + registers[b];
    return registers;
  };
  const addi = (registers, a, b, c) => {
    registers[c] = registers[a] + b;
    return registers;
  };
  const mulr = (registers, a, b, c) => {
    registers[c] = registers[a] * registers[b];
    return registers;
  };
  const muli = (registers, a, b, c) => {
    registers[c] = registers[a] * b;
    return registers;
  };
  const banr = (registers, a, b, c) => {
    registers[c] = registers[a] & registers[b];
    return registers;
  };
  const bani = (registers, a, b, c) => {
    registers[c] = registers[a] & b;
    return registers;
  };
  const borr = (registers, a, b, c) => {
    registers[c] = registers[a] | registers[b];
    return registers;
  };
  const bori = (registers, a, b, c) => {
    registers[c] = registers[a] | b;
    return registers;
  };
  const setr = (registers, a, b, c) => {
    registers[c] = registers[a];
    return registers;
  };
  const seti = (registers, a, b, c) => {
    registers[c] = a;
    return registers;
  };
  const gtir = (registers, a, b, c) => {
    registers[c] = a > registers[b] ? 1 : 0;
    return registers;
  };
  const gtri = (registers, a, b, c) => {
    registers[c] = registers[a] > b ? 1 : 0;
    return registers;
  };
  const gtrr = (registers, a, b, c) => {
    registers[c] = registers[a] > registers[b] ? 1 : 0;
    return registers;
  };
  const eqir = (registers, a, b, c) => {
    registers[c] = a === registers[b] ? 1 : 0;
    return registers;
  };
  const eqri = (registers, a, b, c) => {
    registers[c] = registers[a] === b ? 1 : 0;
    return registers;
  };
  const eqrr = (registers, a, b, c) => {
    registers[c] = registers[a] === registers[b] ? 1 : 0;
    return registers;
  };
  const opcodes = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

  for (let i = 0; i < input.length; i += 4) {
    let [registers] = input[i].match(/\[[^\]]+\]/) || [];
    if (!registers) {
      break;
    }
    registers = JSON.parse(registers);
    const [_, opcode, a, b, c] = input[i + 1].match(/(\d+) (\d+) (\d+) (\d+)/);
    let [expected] = input[i + 2].match(/\[[^\]]+\]/);
    expected = JSON.parse(expected).join(',');

    let matches = 0;
    for (let opcode of opcodes) {
      if (opcode([...registers], +a, +b, +c).join(',') === expected) {
        matches++;
      }
    }

    if (matches >= 3) {
      result++;
    }
  }

  return result;
}