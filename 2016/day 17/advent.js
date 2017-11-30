var runner = require('../runner.js');
var crypto = require('crypto');

runner.run('pxxbnzuo', function(input, isTest) {
  var result = 0;

  var part2 = true;

  var passcode = input[0];

  var start = {
    moves: '',
    x: 0,
    y: 0
  };

  var result = runGraph([start]);
  
  function runGraph(queue) {
    var history = {};
    var steps = 0;

    while (queue.length) {
      var state = queue.shift();
      var moves = state.moves;

      if (state.y === 3 && state.x === 3) {
        if (part2) {
          steps = Math.max(moves.length, steps);
          continue;
        } else {
          return moves;
        }
      }

      if (history[JSON.stringify(state)]) {
        continue;
      }
      history[JSON.stringify(state)] = true;

      var newMoves = getMoves(state.moves);
      for (var key in newMoves) {
        if (newMoves[key]) {
          var next = {
            moves: moves + key,
            x: state.x,
            y: state.y
          }

          if (key === 'U') {
            next.y--;
          } else if (key === 'D') {
            next.y++;
          } else if (key === 'R') {
            next.x++;
          } else if (key === 'L') {
            next.x--;
          }

          if (next.x >= 0 && next.x <= 3 && next.y >= 0 && next.y <= 3) {
            insertNode(next, queue);
          }
        }
      }
    }

    return steps;
  }

  function insertNode(node, queue) {
    if (part2) {
      var i = 0;
      for (; i < queue.length; i++) {
        var comp = queue[i];
        var dist = 6 - node.x - node.y;
        var dist2 = 6 - comp.x - comp.y;

        if (dist2 < dist) {
          break;
        }
      }

      queue.splice(i, 0, node);
    } else {
      queue.push(node);
    }
  }


  function getMoves(previousMoves) {
    var moves = {};

    var hash = crypto.createHash('md5').update(passcode + previousMoves).digest('hex');

    moves.U = /^(?:b|c|d|e|f)/.test(hash);
    moves.D = /^.(?:b|c|d|e|f)/.test(hash);
    moves.L = /^.{2}(?:b|c|d|e|f)/.test(hash);
    moves.R = /^.{3}(?:b|c|d|e|f)/.test(hash);

    return moves;
  }

  return result;
},
[
'ihgpwlah',
'kglvqrro',
'ulqzkmiv'
], 
false, true, false);

