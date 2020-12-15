module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  let andMask;
  let orMask;
  let floatMasks = [];
  const memory = {};

  function getPermutations(arr) {
    if (!arr.length) {
      return [BigInt(0)];
    }
    const shift = arr.shift();
    let val = BigInt(1) << shift;
    const perm = getPermutations(arr);
    return perm.concat(perm.map(p => p | val));
  }

  function setMasks(mask) {
    andMask = isPart2 ? BigInt('0b' + mask.replace(/0/g, '1').replace(/X/g, '0')) : BigInt('0b' + mask.replace(/X/g, '1'));
    orMask = BigInt('0b' + mask.replace(/X/g, '0'));
    if (isPart2) {
      const indices = [];
      let index = -1;
      while (true) {
        index = mask.indexOf('X', index + 1);
        if (index == -1) {
          break;
        }
        indices.push(BigInt(35 - index));
      }
      floatMasks = getPermutations(indices);
    }
  }

  function writeToMemory(address, value) {
    if (!isPart2) {
      value = value & andMask | orMask;
      memory[address] = value;
    } else {
      address = address & andMask | orMask ;
      for (const mask of floatMasks) {
        memory[address | mask] = value;
      }
    }
  }

  for (const command of input) {
    if (command.startsWith('mask')) {
      setMasks(command.match(/[\dX]+/)[0]);
    } else {
      const [_, addr, val] = command.match(/mem\[(\d+)\] = (\d+)/);
      writeToMemory(BigInt(addr), BigInt(val));
    }
  }

  result = Object.values(memory).reduce((acc, i) => acc + i);

  return result;
}