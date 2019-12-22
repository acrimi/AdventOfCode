module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const targetCard = 2019;
  const deckSize = isTest ? 10 : 10007;
  let deck = [];
  for (let i = 0; i < deckSize; i++) {
    deck.push(i);
  }

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

  if (isTest) {
    result = deck.join(' ');
  } else {
    result = deck.indexOf(targetCard);
  }

  return result;
}