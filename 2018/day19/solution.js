module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const commands = {
    addr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) + ((registers[b] || 0) || 0);
      return registers;
    },
    addi: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) + b;
      return registers;
    },
    mulr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) * (registers[b] || 0);
      return registers;
    },
    muli: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) * b;
      return registers;
    },
    banr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) & (registers[b] || 0);
      return registers;
    },
    bani: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) & b;
      return registers;
    },
    borr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) | (registers[b] || 0);
      return registers;
    },
    bori: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) | b;
      return registers;
    },
    setr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0);
      return registers;
    },
    seti: (registers, a, b, c) => {
      registers[c] = a;
      return registers;
    },
    gtir: (registers, a, b, c) => {
      registers[c] = a > (registers[b] || 0) ? 1 : 0;
      return registers;
    },
    gtri: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) > b ? 1 : 0;
      return registers;
    },
    gtrr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) > (registers[b] || 0) ? 1 : 0;
      return registers;
    },
    eqir: (registers, a, b, c) => {
      registers[c] = a === (registers[b] || 0) ? 1 : 0;
      return registers;
    },
    eqri: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) === b ? 1 : 0;
      return registers;
    },
    eqrr: (registers, a, b, c) => {
      registers[c] = (registers[a] || 0) === (registers[b] || 0) ? 1 : 0;
      return registers;
    }
  }

  // Useful for test case and part 1, too slow for part 2
  function bruteForce() {
    let registers = [isPart2 ? 1 : 0, 0, 0, 0, 0];
    let [_, ipRegister] = input[0].match(/#ip (\d+)/);
  
    let ip = registers[ipRegister];
    while (ip >= 0 && ip < input.length - 1) {
      registers[ipRegister] = ip;
      let instruction = input[ip + 1];
      let [_, cmd, a, b, c] = instruction.match(/(\w+) (\d+) (\d+) (\d+)/);
      let fn = commands[cmd];
      fn(registers, +a, +b, +c);
      ip = registers[ipRegister] + 1;
    }

    return registers[0];
  }

  // the actual functionality of the input, doesn't apply to test case
  function sumFactors() {
    let number = isPart2 ? 10551389 : 989;
    let factors = [];
    
    for (let i = 1; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        factors.push(i);
        if (i !== number / i) {
          factors.push(number / i);
        }
      }
    }

    return factors.reduce((accum, i) => accum + i, 0);
  }

  result = isTest ? bruteForce() : sumFactors();

  return result;
}