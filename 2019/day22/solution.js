module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const targetCard = 2019;
  const targetPosition = 2020;
  const deckSize = isTest ? 10 : (isPart2 ? 119315717514047 : 10007);
  const iterations = isPart2 ? 101741582076661 : 1;
  let deck = [];
  if (!isPart2) {
    for (let i = 0; i < deckSize; i++) {
      deck.push(i);
    }
  }

  const transforms = {
    ['deal,deal']: (index) => {
      input.splice(index, 2);
    },
    ['deal,cut']: (index, _, y) => {
      input.splice(
        index,
        2,
        'cut ' + (-y),
        'deal into new stack'
      );
    },
    ['deal']: (index) => {
      input.splice(
        index,
        1,
        'deal with increment -1',
        'cut 1'
      );
    },
    ['cut,deal']: (index, x) => {
      input.splice(
        index,
        2,
        'deal into new stack',
        'cut ' + (-x)
      );
    },
    ['deal,increment']: (index, _, y) => {
      input.splice(
        index,
        2,
        'cut -1',
        'deal with increment ' + (-y)
      );
    },
    ['cut,increment']: (index, x, y) => {
      const L = BigInt(deckSize);
      input.splice(
        index,
        2,
        'deal with increment ' + y,
        'cut ' + (((L + BigInt(x)) * (L + BigInt(y))) % L)
      );
    },
    ['cut,cut']: (index, x, y) => {
      const L = BigInt(deckSize);
      input.splice(
        index,
        2,
        'cut ' + (((L + BigInt(x)) + (L + BigInt(y))) % L)
      );
    },
    ['increment,increment']: (index, x, y) => {
      const L = BigInt(deckSize);
      input.splice(
        index,
        2,
        'deal with increment ' + ((((L + BigInt(x)) % L) * ((L + BigInt(y)) % L)) % L)
      );
    }
  };

  const nearestPowerOfTwo = (ceiling) => {
    let val = 1n;
    while (ceiling > val << 1n && val << 1n > 0) {
      val = val << 1n;
    }
    return Number(val);
  };

  const pow = (base, exponent, mod) => {
    if (exponent == 0) {
      return 1;
    } else if (exponent == 1) {
      return  base % mod;
    } else if (exponent % 2n == 0) {
      return pow((base * base) % mod,  exponent / 2n, mod);
    } else {
      return (base * pow((base * base) % mod, (exponent - 1n) / 2n, mod)) % mod;
    }
  };
  
  const reduceInput = () => {
    let reduce = true;
    let expand = false;
    while (input.length > 2) {
      const len = input.length;
      let changed = false;
      for (let i = 0; i < input.length - 1; i++) {
        const cmd1 = input[i];
        const cmd2 = input[i + 1];
        const type1 = cmd1.includes('cut') ? 'cut' : (cmd1.includes('increment') ? 'increment' : 'deal');
        const type2 = cmd2.includes('cut') ? 'cut' : (cmd2.includes('increment') ? 'increment' : 'deal');
        const x = type1 !== 'deal' && +cmd1.match(/-?\d+/)[0];
        const y = type2 !== 'deal' && +cmd2.match(/-?\d+/)[0];
        const transform = `${type1},${type2}`;
        if (expand && type1 === 'deal') {
          transforms.deal(i);
        } else if ((!reduce || type1 === type2) && transforms[transform]) {
          transforms[transform](i, x, y);
          changed = true;
        }
      }
      if (!expand && reduce && !changed) {
        expand = true;
      } else if (reduce && len === input.length) {
        reduce = false;
      } else {
        reduce = true;
      }
    }
  };

  const shuffleCards = () => {
    for (let line of input) {
      let match;
      if ((match = line.match(/cut (-?\d+)/)) != null) {
        const offset = +match[1];
        deck = deck.slice(offset).concat(deck.slice(0, offset));
      } else if ((match = line.match(/deal with increment (\d+)/)) != null) {
        const increment = +match[1];
        const arr = [];
        for (let i = 0, a = 0; i < deck.length; i++, a = (a + increment) % deck.length) {
          arr[a] = deck[i];
        }
        deck = arr;
      } else if (line === 'deal into new stack') {
        deck.reverse();
      }
    }
  };

  const calculateOriginalPosition = (input, position) => {
    input.reverse();
    for (let line of input) {
      let match;
      if ((match = line.match(/cut (-?\d+)/)) != null) {
        let offset = +match[1];
        if (offset < 0) {
          offset = deckSize + offset;
        }
        if (position < deckSize - offset) {
          position += offset;
        } else {
          position -= (deckSize - offset);
        }
      } else if ((match = line.match(/deal with increment (\d+)/)) != null) {
        const increment = BigInt(+match[1]);
        const L = BigInt(deckSize);
        const inverse = pow(increment, L - 2n, L);
        position = Number((BigInt(position) * inverse) % L);
      } else if (line === 'deal into new stack') {
        position = deckSize - 1 - position;
      }
    }
    return position;
  };

  reduceInput();
  if (isTest) {
    shuffleCards();
    result = deck.join(' ');
  } else if (!isPart2) {
    shuffleCards();
    result = deck.indexOf(targetCard);
  } else {
    const formulae = {
      1: [].concat(input)
    }
    let nextIteration = 2;
    while (nextIteration < iterations) {
      input.splice(input.length, 0, ...input);
      reduceInput();
      formulae[nextIteration] = [].concat(input);
      nextIteration *= 2;
    }
    let position = targetPosition;
    let remainingIterations = iterations;
    while (remainingIterations > 0) {
      const po2 = nearestPowerOfTwo(remainingIterations);
      position = calculateOriginalPosition(formulae[po2], position);
      remainingIterations -= po2;
    }
    result = position;
  }

  return result;
}