module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const generationCount = isPart2 ? 50000000000 : 20;
  const [initial] = input[0].match(/[.#]+/);
  const rules = {};
  let currentState = '.....' + initial + '.....';
  let zeroPot = 5;
  let stableGeneration = -1;
  let generationalOffset = 0;

  for (let i = 2; i < input.length; i++) {
    const [_, rule, output] = input[i].match(/([.#]+) => ([.#])/);
    rules[rule] = output;
  }

  for (let i = 0; i < generationCount; i++) {
    let newState = '';
    let pre = '';
    let maxChanged = 0;
    let newZeroPot = zeroPot;

    for (let j = 0; j < currentState.length; j++) {
      let pattern = '';
      for (let k = j - 2; k < 0; k++) {
        pattern += '.';
      }
      pattern = currentState.substr(j-2, 5);
      while (pattern.length < 5) {
        pattern += '.';
      }
      
      let value = rules[pattern] || '.';
      if (j < 5 && (value !== currentState[j] || pre.length > 0)) {
        pre += '.';
      } else if (j > currentState.length - 6 && value !== currentState[j]) {
        maxChanged = j;
      }
      newState += rules[pattern] || '.';
    }

    let dif = maxChanged - (currentState.length - 6);
    for (let j = 0; j < dif; j++) {
      newState += '.';
    }
    newState = pre + newState;
    newZeroPot += pre.length;

    let len = newState.length;
    newState = newState.replace(/(?:^\.+(?=\.{5}))|(?:(?<=\.{5})\.+$)/, '');
    newZeroPot -= len - newState.length;
    
    if (newState === currentState) {
      // state has stabilized
      stableGeneration = i;
      generationalOffset = zeroPot - newZeroPot;
      i = generationCount; // break loop early
    }

    zeroPot = newZeroPot
    currentState = newState;
  }

  let numPlants = 0;
  for (let i = 0; i < currentState.length; i++) {
    if (currentState[i] === '#') {
      result += i - zeroPot;
      numPlants++;
    }
  }

  if (stableGeneration >= 0) {
    let generationDif = generationCount - 1 - stableGeneration;
    result = result + (numPlants * generationDif * generationalOffset);
  }

  return result;
}