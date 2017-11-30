var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var state = {
    depth: 0,
    parent: null,
    value: Number.MAX_VALUE,
    current: 0,
    floors: [[], [], [], []]
  };

  for (var i = 0; i < input.length; i++) {
    var line = input[i];
    line.replace(/(\w+?)(?:-compatible)? (microchip|generator)/g, function(match, element, type) {
      state.floors[i].push(element.substring(0, 2) + '-' + type.charAt(0));
    });
  }

  // Part 2
  // state.floors[0].push('el-g', 'el-m', 'di-g', 'di-m');

  var target = {
    depth: 0,
    parent: null,
    value: Number.MAX_VALUE,
    current: 3,
    floors: [[], [], []]
  };
  target.floors[3] = state.floors.reduce(function(a, b) {
    return a.concat(b);
  });

  var startHistory = {};
  var endHistory = {};
  var startQueue = [state];
  var endQueue = [target];

  var result = processTrees();

  function processTrees() {
    while (startQueue.length || endQueue.length) {
      if (startQueue.length) {
        var depth = evalNextInQueue(startQueue, startHistory, endHistory);
        if (depth != null) {
          return depth;
        }
      }

      if (endQueue.length) {
        var depth = evalNextInQueue(endQueue, endHistory, startHistory);
        if (depth != null) {
          return depth;
        }
      }
    }
  }

  function evalNextInQueue(queue, history, targets) {
    var nextNode = queue.shift();
    var hash = hashState(nextNode);

    if (targets[hash] != null) {
      return nextNode.depth + targets[hash];
    }

    if (history[hash] != null) {
      history[hash] = Math.min(nextNode.depth, history[hash]);
      return;
    }

    history[hash] = nextNode.depth;

    var moves = getAvailableMoves(nextNode);

    for (var i = 0; i < moves.length; i++) {
      var newState = applyMove(moves[i], nextNode);
      insertNode(newState, queue);
    }
  }

  function insertNode(node, queue) {
    queue.push(node);
  }

  function hashState(state) {
    var hash = state.current +'';

    // var items = {};
    // for (var i = 0; i < state.floors.length; i++) {
    //   var floor = state.floors[i];

    //   for (var j = 0; j < floor.length; j++) {
    //     var type;
    //     if (type = getGeneratorType(floor[j])) {
    //       if (items[type] != null) {
    //         hash += '('+i+items[type]+')';
    //       }
    //     } else {
    //       type = getChipType(floor[j]);
    //       if (items[type] != null) {
    //         hash += '('+items[type]+i+')';
    //       }
    //     }

    //     items[type] = i;
    //   }
    // }

    for (var i = 0; i < state.floors.length; i++) {
      var fl = state.floors[i];

      var gens = 0;
      var chips = 0;

      for (var j = 0; j < fl.length; j++) {
        if (getGeneratorType(fl[j])) {
          gens++;
        } else {
          chips++;
        }
      }

      hash += '[g'+gens+'c'+chips+']';
    }

    return hash;
  }

  function applyMove(move, state) {
    var newState = {
      depth: state.depth + 1,
      parent: state,
      value: Number.MAX_VALUE,
      current: state.current + move.direction,
      floors: cloneFloors(state.floors)
    };
    var current = newState.floors[state.current];
    var next = newState.floors[newState.current];

    current.splice(current.indexOf(move.item1), 1);
    next.push(move.item1);
    if (move.item2) {
      current.splice(current.indexOf(move.item2), 1);
      next.push(move.item2);
    }

    return newState;
  }

  function getAvailableMoves(state) {
    var ups = [];
    var downs = [];
    var current = state.floors[state.current];

    for (var i = 0; i < current.length; i++) {
      var item = current[i];
      if (canMove({item1: item, direction: 1}, state)) {
        ups.push({item1: item, direction: 1});
      }
      if (canMove({item1: item, direction: -1}, state)) {
        downs.unshift({item1: item, direction: -1});
      }

      for (var j = i+1; j < current.length; j++) {
        var item2 = current[j];
        if (canMove({item1: item, item2: item2, direction: 1}, state)) {
          ups.unshift({item1: item, item2: item2, direction: 1});
        }
        if (canMove({item1: item, item2: item2, direction: -1}, state)) {
          downs.push({item1: item, item2: item2, direction: -1});
        }
      }
    }

    return ups.concat(downs);
  }

  function canMove(move, state) {
    if ((move.direction > 0 && state.current >= state.floors.length-1) ||
        (move.direction < 0 && state.current <= 0)) {
      return false;
    }
    var newState = applyMove(move, state);
    return isStateValid(newState);
  }

  function isStateValid(state) {
    for (var i = 0; i < state.floors.length; i++) {
      if (!isFloorValid(state.floors[i])) {
        return false;
      }
    }

    return true;
  }

  function isFloorValid(floor) {
    for (var i = 0; i < floor.length; i++) {
      var item = floor[i];
      if (willChipFry(item, floor)) {
        return false;
      }
    }

    return true;
  }

  function willChipFry(chip, floor) {
    var el = getChipType(chip);
    if (el) {
      if (floor.indexOf(el+'-g') < 0) {
        for (var i = 0; i < floor.length; i++) {
          var gen = floor[i];
          if (/-g$/.test(gen)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function getGeneratorType(item) {
    return /-g$/.test(item) ? item.substring(0, item.indexOf('-')) : null;
  }

  function getChipType(item) {
    return /-m$/.test(item) ? item.substring(0, item.indexOf('-')) : null;
  }

  function cloneFloors(floors) {
    var clone = [];
    for (var i = 0; i < floors.length; i++) {
      clone.push([].concat(floors[i]));
    }

    return clone;
  }

  return result;
},
3, 
false, true, false);

