module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let [_, playerCount, lastMarble] = input.match(/(\d+) players; last marble is worth (\d+) points/);
  playerCount = +playerCount;
  lastMarble = +lastMarble;

  const players = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      points: 0
    });
  }

  let marbles = [0];
  let currentMarble = 0;

  const insertMarble = (value) => {
    let insertPoint = currentMarble + 2;
    insertPoint %= marbles.length;
    marbles.splice(insertPoint, 0, value);
    currentMarble = insertPoint;
  };

  const takeMarble = () => {
    let takePoint = currentMarble - 7 + marbles.length;
    takePoint %= marbles.length;
    let value = marbles[takePoint];
    marbles.splice(takePoint, 1);
    currentMarble = takePoint
    return value;
  }

  for (let i = 1; i <= lastMarble; i++) {
    let player = players[(i - 1) % playerCount];
    if (i % 23 === 0) {
      player.points += i;
      player.points += takeMarble();
    } else {
      insertMarble(i);
    }
  }

  for (let player of players) {
    result = Math.max(player.points, result);
  }

  return result;
}