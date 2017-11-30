var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var numbers = {};
  var grid = [];
  
  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    
    grid[i] = line.split('');

    line.replace(/\d/g, function(match, index) {
      numbers[match] = {
        pos: {
          x: index,
          y: i
        },
        distance: {},
        depth: 0
      };
    });
  }

  for (var key in numbers) {
    var info = numbers[key];
    for (var key2 in numbers) {
      if (key2 !== key) {
        info.distance[key2] = runGraph([info], key2);
      }
    }
  }

  var permutations = [];
  getPermutations(['0'], ['1','2','3','4','5','6','7']);

  result = Number.MAX_VALUE;
  for (var i = 0; i < permutations.length; i++) {
    var permutation = permutations[i];
    var length = 0;
    for (var j = 1; j < permutation.length; j++) {
      var dist = numbers[permutation[j]].distance[permutation[j-1]];
      length += dist;
    }
    result = Math.min(length, result);
  }

  function getPermutations(taken, rest) {
    if (rest.length === 0) {
      // Part 2
      // taken.push('0');
      permutations.push(taken);
    } else {
      for (var i = 0; i < rest.length; i++) {
        var next = rest[i];
        var taken2 = taken.concat([next]);
        var rest2 = [].concat(rest);
        rest2.splice(i, 1);
        getPermutations(taken2, rest2);
      }
    }
  }

  function runGraph(queue, target) {
    var history = {};

    while (queue.length) {
      var state = queue.shift();
      var position = state.pos;

      if (history[JSON.stringify(position)]) {
        continue;
      }
      history[JSON.stringify(position)] = true;

      var moves = getViableMoves(position);
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        var nextPosition = {x: position.x + move[0], y: position.y + move[1]};
        var nextState = {
          depth: state.depth + 1,
          pos: nextPosition
        };

        if (grid[nextPosition.y][nextPosition.x] === target) {
          return nextState.depth;
        }

        addToQueue(nextState, queue);
      }
    }
  }

  function addToQueue(state, queue) {
    queue.push(state);
  }

  function getViableMoves(position) {
    var moves = [];
    for (var x = position.x - 1; x < position.x + 2; x++) {
      if (x < 0 || x === position.x) {
        continue;
      }

      if (testMove(x, position.y)) {
        moves.push([x-position.x, 0]);
      }
    }

    for (var y = position.y - 1; y < position.y + 2; y++) {
      if (y < 0 || y === position.y) {
        continue;
      }

      if (testMove(position.x, y)) {
        moves.push([0, y-position.y]);
      }
    }

    return moves;
  }

  function testMove(x, y) {
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length && 
        grid[y][x] !== '#') {
      return true;
    }

    return false;
  }

  return result;
},
[

],
false, true, false);

