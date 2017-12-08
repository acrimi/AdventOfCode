module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let registers = {};

  let allTimeHighest = Number.MIN_SAFE_INTEGER;
  for (let line of input) {
    line.replace(/(\w+) (\w+) (-?\d+) if (\w+) (\S+) (-?\d+)/, (match, register, operation, amount, testRegister, operand, testAmount) => {
      registers[register] = registers[register] || 0;
      let testRegisterValue = registers[testRegister] = registers[testRegister] || 0;
      testAmount = +testAmount;

      let passConditional = false;
      switch (operand) {
      case '==':
        passConditional = testRegisterValue == testAmount;
        break;
      case '!=':
        passConditional = testRegisterValue != testAmount;
        break;
      case '>=':
        passConditional = testRegisterValue >= testAmount;
        break;
      case '<=':
       passConditional = testRegisterValue <= testAmount;
       break;
      case '>':
        passConditional = testRegisterValue > testAmount;
        break;
      case '<':
       passConditional = testRegisterValue < testAmount;
        break;
      }

      if (passConditional) {
        if (operation == 'inc') {
          registers[register] += (+amount);
        } else if (operation == 'dec') {
          registers[register] -= (+amount);
        }
      }

      allTimeHighest = Math.max(...Object.values(registers).concat(allTimeHighest));
    });
  }

  result = Math.max(...Object.values(registers));

  if (isPart2) {
    result = allTimeHighest;
  }

  return result;
}