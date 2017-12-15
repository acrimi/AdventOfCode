module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let startA = +input[0].match(/\d+/)[0];
  let startB = +input[1].match(/\d+/)[0];
  let factorA = 16807;
  let factorB = 48271;
  let divisor = 2147483647;
  let cycles = isPart2 ? 5000000 : 40000000;

  const generateA = (previousA) => {
    let a = (previousA * factorA) % divisor;
    if (isPart2 && a % 4 !== 0) {
      a = generateA(a);
    }
    return a;
  };

  const generateB = (previousB) => {
    let b = (previousB * factorB) % divisor;
    if (isPart2 && b % 8 !== 0) {
      b = generateB(b);
    }
    return b;
  }

  const valuesMatch = (a, b) => {
    return (a & 0xFFFF) === (b & 0xFFFF);
  };

  let a = startA;
  let b = startB;
  for (let i = 0; i < cycles; i++) {
    a = generateA(a);
    b = generateB(b);
    if (valuesMatch(a, b)) {
      result++;
    }
  }

  return result;
}