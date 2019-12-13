const IntcodeComputer = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  if (isPart2) {
    input[0] = 2;
  }
  const comp = new IntcodeComputer(input);
  const blockTile = 2;
  const paddleTile = 3;
  const ballTile = 4;
  const tileSymbols = [
    ' ', // empty
    'X', // wall
    '#', // block
    '=', // paddle
    'O'  // ball
  ]
  const board = [];
  let paddleX = 0;
  let ballX = 0;
  let score = 0;

  const main = () => {
    const res = comp.execute(null, true);
    const outputs = res.value;
    for (let i = 0; i < outputs.length; i += 3) {
      const x = outputs[i];
      const y = outputs[i + 1];
      const id = outputs[i + 2];
      
      if (!isPart2) {
        if (id == blockTile) {
          result++;
        }
      } else {
        if (x === -1 && y === 0) {
          score = id;
        } else {
          const row = board[y] = board[y] || [];
          row[x] = tileSymbols[id];
          if (id === paddleTile) {
            paddleX = x;
          } else if (id === ballTile) {
            ballX = x;
          }
        }
      }
    }

    return res.done;
  }

  if (!isPart2) {
    main();
  } else {
    while (!main()) {
      comp.pushInput(Math.sign(ballX - paddleX));
    }
    result = score;
  }

  return result;
}