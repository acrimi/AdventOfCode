module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const players = [[], []];

  let deck = players[0];
  for (const line of input) {
    if (line.length == 0) {
      deck = players[1];
    } else if (!line.startsWith('Player')) {
      deck.push(+line);
    }
  }

  function playGame(players) {
    const states = {};
    while (players[0].length > 0 && players[1].length > 0) {
      if (isPart2) {
        const state = JSON.stringify(players);
        if (states[state]) {
          return 0;
        }
        states[state] = true;
      }
      const c1 = players[0].shift();
      const c2 = players[1].shift();

      let winner;
      if (isPart2 && c1 <= players[0].length && c2 <= players[1].length) {
        winner = playGame([players[0].slice(0, c1), players[1].slice(0, c2)]);
      }

      if (winner == null) {
        if (c1 > c2) {
          winner = 0;
        } else {
          winner = 1;
        }
      }
      if (winner == 0) {
        players[0].push(c1, c2);
      } else {
        players[1].push(c2, c1);
      }
    }
    return players.findIndex(p => p.length > 0);
  }

  const winner = players[playGame(players)];
  for (let i = 0; i < winner.length; i++) {
    const multiplier = winner.length - i;
    result += winner[i] * multiplier;
  }

  return result;
}