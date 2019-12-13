const IntcodeComputer = require('../intcode');

// Fully playable game for part 2:
// < or , to move left
// > or . to move right
// s to save the current state
// enter to move to next frame
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
  let paddleY = 0;
  let gameOver = false;
  let score = 0;
  const validatedInputs = [];
  const pendingInputs = [];

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
            paddleY = y;
          } else if (id === ballTile) {
            if (y >= paddleY) {
              gameOver = true;
            }
          }
        }
      }
    }

    if (isPart2) {
      console.log(board.map(r => r.join('')).join('\n'));
      console.log('SCORE:', score);
    }

    return res.done;
  }

  const reset = () => {
    gameOver = false;
    pendingInputs.splice(0, pendingInputs.length);
    comp.reset(input);
    comp.pushInput(validatedInputs);
    main();
  }

  if (!isPart2) {
    main();
  } else {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'INPUT>'
    });

    readline.on('line', line => {
      switch (line.trim()) {
        case '<':
        case ',':
          pendingInputs.push(-1);
          comp.pushInput(-1);
          break;
        case '>':
        case '.':
          pendingInputs.push(1);
          comp.pushInput(1);
          break;
        case 's':
          validatedInputs.push(...pendingInputs);
          pendingInputs.splice(0, pendingInputs.length);
          readline.prompt();
          return;
        default:
          pendingInputs.push(0);
          comp.pushInput(0);
          break;
      }
      if (main()) {
        if (gameOver) {
          console.log('GAME OVER. RESETTING...');
          setTimeout(() => {
            reset();
            readline.prompt();
          }, 1000);
        } else {
          readline.close();
          console.log('YOU WIN!');
        }
      } else {
        readline.prompt();
      }
    });
    main();
    readline.prompt();
  }

  return result;
}