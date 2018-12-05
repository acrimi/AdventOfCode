module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const A = 'A'.charCodeAt(0);
  const Z = 'Z'.charCodeAt(0);
  const reduceInput = (input) => {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = A; i <= Z; i++) {
        let character = String.fromCharCode(i);
        let lower = character.toLowerCase();
        let regex = new RegExp(`${character}${lower}|${lower}${character}`, 'g');

        let len = input.length;
        input = input.replace(regex, '');
        changed = changed || len !== input.length;
      }
    }
    return input;
  }

  if (!isPart2) {
    result = reduceInput(input).length;
  } else {
    result = input.length;
    for (let i = A; i <= Z; i++) {
      let character = String.fromCharCode(i);
      let regex = new RegExp(character, 'gi');
      let replaced = input.replace(regex, '');
      let len = reduceInput(replaced).length;
      if (len < result) {
        result = len;
      }
    }
  }

  return result;
}