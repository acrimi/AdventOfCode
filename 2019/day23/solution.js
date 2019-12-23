const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const addresses = 50;
  const comps = [];
  const lastRead = [];
  const natPacket = {};
  const yValues = [];
  for (let i = 0; i < addresses; i++) {
    const comp = new IntcodeComputer(input);
    comp.pushInput(i);
    comps.push(comp);
    lastRead.push(-1);
  }

  main:
  while (true) {
    let active = false;
    for (let i = 0; i < comps.length; i++) {
      const comp = comps[i];
      comp.execute(-1, true);
      const output = comp.getOutputs();
      for (let p = lastRead[i] + 1; p < output.length - 2; p += 3) {
        active = true;
        const address = output[p];
        const x = output[p + 1];
        const y = output[p + 2];
        lastRead[i] = p + 2;

        if (address === 255) {
          if (!isPart2) {
            result = y;
            break main;
          } else {
            natPacket.x = x;
            natPacket.y = y;
            continue;
          }
        }
        comps[address].pushInput([x, y]);
      }
    }

    if (!active) {
      if (yValues.includes(natPacket.y)) {
        result = natPacket.y;
        break;
      }
      yValues.push(natPacket.y);
      comps[0].pushInput([natPacket.x, natPacket.y]);
    }
  }

  return result;
}