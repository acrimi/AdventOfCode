module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const programCount = isTest ? 5 : 16;
  const programs = [];
  const aCode = 'a'.charCodeAt(0);
  for (let i = 0; i < programCount; i++) {
    programs.push(String.fromCharCode(aCode + i));
  }

  const arrangements = {};

  const dance = () => {
    for (let move of input) {
      const type = move.slice(0, 1);
      if (type === 's') {
        let [count] = move.match(/\d+/);
        let sublist = programs.splice(-count, count);
        programs.unshift(...sublist);
      } else if (type === 'x') {
        let [x, indexA, indexB] = move.match(/(\d+)\/(\d+)/);
        let a = programs[+indexA];
        let b = programs[+indexB];
        programs[+indexA] = b;
        programs[+indexB] = a;
      } else if (type === 'p') {
        let [x, nameA, nameB] = move.match(/p(\w+)\/(\w+)/);
        let indexA, indexB;
        let a, b;
        for (let i = 0; i < programs.length; i++) {
          if (programs[i] === nameA) {
            indexA = i;
            a = programs[i];
          } else if (programs[i] === nameB) {
            indexB = i;
            b = programs[i];
          }
        }
        
        programs[indexA] = b;
        programs[indexB] = a;
      }
    }
  }

  let count = isPart2 ? 4e9 : 1;
  for (let i = 0; i < count; i++) {
    const arrangement = programs.join('');
    if (count === 4e9 && arrangements[arrangement] >= 0) {
      const loopSize = i - arrangements[arrangement];
      i = 0;
      count %= loopSize;
      if (count === 0) {
        break;
      }
    }
    arrangements[arrangement] = i;
    dance();
  }

  result = programs.join('');

  return result;
}