module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const addr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) + ((registers[b] || 0) || 0);
    return registers;
  };
  const addi = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) + b;
    return registers;
  };
  const mulr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) * (registers[b] || 0);
    return registers;
  };
  const muli = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) * b;
    return registers;
  };
  const banr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) & (registers[b] || 0);
    return registers;
  };
  const bani = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) & b;
    return registers;
  };
  const borr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) | (registers[b] || 0);
    return registers;
  };
  const bori = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) | b;
    return registers;
  };
  const setr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0);
    return registers;
  };
  const seti = (registers, a, b, c) => {
    registers[c] = a;
    return registers;
  };
  const gtir = (registers, a, b, c) => {
    registers[c] = a > (registers[b] || 0) ? 1 : 0;
    return registers;
  };
  const gtri = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) > b ? 1 : 0;
    return registers;
  };
  const gtrr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) > (registers[b] || 0) ? 1 : 0;
    return registers;
  };
  const eqir = (registers, a, b, c) => {
    registers[c] = a === (registers[b] || 0) ? 1 : 0;
    return registers;
  };
  const eqri = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) === b ? 1 : 0;
    return registers;
  };
  const eqrr = (registers, a, b, c) => {
    registers[c] = (registers[a] || 0) === (registers[b] || 0) ? 1 : 0;
    return registers;
  };
  const opcodes = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];
  const opcodeIds = {};

  let i = 0;
  for (; i < input.length; i += 4) {
    let [registers] = input[i].match(/\[[^\]]+\]/) || [];
    if (!registers) {
      break;
    }
    registers = JSON.parse(registers);
    const [_, opcodeId, a, b, c] = input[i + 1].match(/(\d+) (\d+) (\d+) (\d+)/);
    let [expected] = input[i + 2].match(/\[[^\]]+\]/);
    expected = JSON.parse(expected).join(',');

    let matches = [];
    for (let opcode of opcodes) {
      if (opcode([...registers], +a, +b, +c).join(',') === expected) {
        matches.push(opcode);
      }
    }

    opcodeIds[opcodeId] = (opcodeIds[opcodeId] || matches).filter(fn => matches.includes(fn));

    if (matches.length >= 3) {
      result++;
    }
  }

  if (isPart2) {
    let unresolved = true;
    while (unresolved) {
      unresolved = false;
      for (let id in opcodeIds) {
        let matches = opcodeIds[id];
        if (matches.length === 1) {
          let opcode = matches[0];
          for (let id2 in opcodeIds) {
            if (id2 !== id) {
              opcodeIds[id2] = opcodeIds[id2].filter(fn => fn !== opcode);
            }
          }
        } else {
          unresolved = true;
        }
      }
    }

    let registers = {};
    for (; i < input.length; i++) {
      const [_, opcodeId, a, b, c] = input[i].match(/(\d+) (\d+) (\d+) (\d+)/) || [];
      if (!opcodeId) {
        continue;
      }

      let opcode = opcodeIds[opcodeId][0];
      opcode(registers, +a, +b, +c);
    }

    result = registers[0];
  }

  return result;
}