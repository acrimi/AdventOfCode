module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  let andMask;
  let orMask;
  const memory = [];

  function setMasks(mask) {
    andMask = BigInt('0b' + mask.replace(/X/g, '1'));
    orMask = BigInt('0b' + mask.replace(/X/g, '0'));
  }

  function writeToMemory(address, value) {
    value = BigInt(value) & andMask | orMask;
    memory[address] = value;
  }

  for (const command of input) {
    if (command.startsWith('mask')) {
      setMasks(command.match(/[\dX]+/)[0]);
    } else {
      const [_, addr, val] = command.match(/mem\[(\d+)\] = (\d+)/);
      writeToMemory(addr, +val);
    }
  }

  result = memory.reduce((acc, i) => acc + (i || 0));

  return result;
}