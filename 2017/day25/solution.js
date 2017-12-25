module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const cycles = 12794428;
  const tape = [];
  let state = 'a';
  let position = 0;

  const states = {
    a: (value) => {
      if (value === 0) {
        tape[position] = 1;
        result++;
        position++;
        state = 'b';
      } else {
        tape[position] = 0;
        result--;
        position--;
        state = 'f';
      }
    },
    b: (value) => {
      if (value === 0) {
        position++;
        state = 'c';
      } else {
        tape[position] = 0;
        result--;
        position++;
        state = 'd';
      }
    },
    c: (value) => {
      if (value === 0) {
        tape[position] = 1;
        result++;
        position--;
        state = 'd';
      } else {
        position++;
        state = 'e';
      }
    },
    d: (value) => {
      if (value === 0) {
        position--;
        state = 'e';
      } else {
        tape[position] = 0;
        result--;
        position--;
        state = 'd';
      }
    },
    e: (value) => {
      if (value === 0) {
        position++;
        state = 'a';
      } else {
        position++;
        state = 'c';
      }
    },
    f: (value) => {
      if (value === 0) {
        tape[position] = 1;
        result++;
        position--;
        state = 'a';
      } else {
        position++;
        state = 'a';
      }
    }
  };

  for (let i = 0; i < cycles; i++) {
    let value = tape[position] || 0;
    states[state](value);
  }

  return result;
}