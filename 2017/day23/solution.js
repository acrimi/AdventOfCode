module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let registers = {};
  let index = 0;

  const processInput = (line) => {
    let [m, instruction, x, y] = line.match(/^(\w+) (\S+)(?: (\S+))?/) || [];
    let value = isNaN(+y) ? registers[y] || 0 : +y;
    let xValue = isNaN(+x) ? registers[x] || 0 : +x; 
    switch (instruction) {
      case 'set':
        registers[x] = value;
        break;
      case 'sub':
        registers[x] = (registers[x] || 0) - value;
        break;
      case 'mul':
        registers[x] = (registers[x] || 0) * value;
        !isPart2 && result++;
        break;
      case 'jnz':
        if (xValue !== 0) {
          index += value - 1;
        }
        break;
    }
  };

  const isPrime = (value) => {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
  };

  if (!isPart2) {
    while (index < input.length) {
      processInput(input[index]);
      index++;
    }
  } else {
    let b = 107900;
    let i = 0;
    do {
      if (!isPrime(b)) {
        result++;
      }
      b += 17;
    } while (i++ < 1000)
  }

  return result;
}