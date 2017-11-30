var runner = require('../runner.js');

runner.run(1350, function(input, isTest) {
  var result = 0;

  input = input[0];

  function isWall(x, y) {
    var res = x*x + 3*x + 2*x*y + y + y*y + input;
    var binString = (res >>> 0).toString(2);
    return binString.match(/1/g).length % 2 != 0;
  }

  var start = {
    depth: 0,
    pos: [1,1]
  };

  var goal;
  if (isTest) {
    goal = [7,4];
  } else {
    goal = [31, 39];
  }

  result = runGraph([start]);

  if (!isTest) {
    part2();
  }


  function runGraph(queue) {
    var history = {};

    while (queue.length) {
      var state = queue.shift();
      var position = state.pos;

      if (history[position]) {
        continue;
      }
      history[position] = true;

      var moves = getViableMoves(position);
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        var nextPosition = [position[0] + move[0], position[1] + move[1]];
        var nextState = {
          depth: state.depth + 1,
          pos: nextPosition
        };

        if (nextPosition[0] === goal[0] && nextPosition[1] === goal[1]) {
          return nextState.depth; 
        }

        addToQueue(nextState, queue);
      }
    }
  }

  function addToQueue(state, queue) {
    queue.push(state);
  }


  function part2() {
    var globalHistory = {};

    runBranch(0, start.pos, {});
    function runBranch(depth, position, history) {
      if (history[position]) {
        return;
      }
      history[position] = true;
      globalHistory[position] = true;
      if (depth === 50) {
        return;
      }
      var moves = getViableMoves(position);
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        var nextPosition = [position[0] + move[0], position[1] + move[1]];
        runBranch(depth + 1, nextPosition, cloneObj(history));
      }
    }

    console.log('part2: '+Object.keys(globalHistory).length);
  }



  function getViableMoves(position) {
    var moves = [];
    for (var x = position[0] - 1; x < position[0] + 2; x++) {
      if (x < 0 || x === position[0]) {
        continue;
      }

      if (testMove(x, position[1])) {
        moves.push([x-position[0], 0]);
      }
    }

    for (var y = position[1] - 1; y < position[1] + 2; y++) {
      if (y < 0 || y === position[1]) {
        continue;
      }

      if (testMove(position[0], y)) {
        moves.push([0, y-position[1]]);
      }
    }

    return moves;
  }

  function testMove(x, y) {
    if (isWall(x, y)) {
      return false;
    }

    return true;
  }


  function cloneObj(obj) {
    var clone = {};
    for (var key in obj) {
      clone[key] = obj[key];
    }

    return clone;
  }
  

  return result;
},
[
10
], 
false, true, false);

