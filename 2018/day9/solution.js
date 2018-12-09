module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let [_, playerCount, lastMarble] = input.match(/(\d+) players; last marble is worth (\d+) points/);
  playerCount = +playerCount;
  lastMarble = +lastMarble;
  if (!isTest && isPart2) {
    lastMarble *= 100;
  }

  const players = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      points: 0
    });
  }

  let currentMarble = {
    value: 0
  };
  currentMarble.next = currentMarble;
  currentMarble.prev = currentMarble;

  const insertMarble = (value) => {
    let leadNode = currentMarble.next;
    let newNode = {
      value: value,
      next: leadNode.next,
      prev: leadNode
    };
    newNode.next.prev = newNode;
    leadNode.next = newNode;
    currentMarble = newNode;
  };

  const takeMarble = () => {
    let target = currentMarble;
    for (let i = 0; i < 7; i++) {
      target = target.prev;
    }
    let value = target.value;
    target.prev.next = target.next;
    target.next.prev = target.prev;
    currentMarble = target.next;
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