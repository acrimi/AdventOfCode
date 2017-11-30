var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var result = 0;

var teaspoons = 100;
var targetCalories = 500;
var ingredients = {};
var names;

var lines = input.split('\n');

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var parts = line.split(' ');
  var name = parts[0].replace(':', '');
  var capacity = parseInt(parts[2].replace(',', ''));
  var durability = parseInt(parts[4].replace(',', ''));
  var flavor = parseInt(parts[6].replace(',', ''));
  var texture = parseInt(parts[8].replace(',', ''));
  var calories = parseInt(parts[10].replace(',', ''));

  ingredients[name] = {
    capacity: capacity,
    durability: durability,
    flavor: flavor,
    texture: texture,
    calories: calories
  };
}

names = Object.keys(ingredients);


var best = -1;
var winner;

var combinations = getNumbers(names.length, teaspoons);

for (var i = 0; i < combinations.length; i++) {
  var counts = combinations[i];

  var val = getScore(counts);
  if (best == -1 || val > best) {
    best = val;
    winner = counts;
  }
}

function getNumbers(count, sum) {
  var res = [];
  var first = sum;

  while (first >= 0) {
    if (count > 1) {
      var next = getNumbers(count-1, sum - first);
      for (var i = 0; i < next.length; i++) {
        var arr = [first].concat(next[i]);
        res.push(arr);
      }
    } else {
      res.push([first]);
    }
    first--;
  }
  
  return res;
}

function getScore(counts) {
  var scores = {
    capacity: 0,
    durability: 0,
    flavor: 0,
    texture: 0,
    calories: 0
  };

  for (var i = 0; i < counts.length; i++) {
    var count = counts[i];
    var name = names[i];

    for (var j = 0; j < count; j++) {
      addIngredient(name);
    }
  }
  

  function addIngredient(name) {
    var props = ingredients[name];
    for (var key in scores) {
      scores[key] += props[key];
    }
  }

  /*
  * Uncomment for Part 2
  */
  // if (scores.calories != targetCalories) {
  //   return 0;
  // }

  var score = 1;
  for (var key in scores) {
    if (key == 'calories') {
      continue;
    }
    score *= Math.max(0, scores[key]);
  }
  return score;
}

result = best;

console.log(result);