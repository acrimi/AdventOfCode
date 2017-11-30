var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var result = 0;

var people = {};

var rules = input.split('\n');

for (var i = 0; i < rules.length; i++) {
  var str = rules[i].replace(/\r|\./g, '');
  var parts = str.split(' ');
  var name = parts[0];

  if (!people[name]) {
    people[name] = {};
  }

  var other = parts[parts.length-1];
  var amount = parseInt(parts[3]);
  if (parts[2] == 'lose') {
    amount = -amount;
  }

  people[name][other] = amount;
}

/*
 * Uncomment for part 2
 */
// people.me = {};
// for (var key in people) {
//   people.me[key] = 0;
//   people[key].me = 0;
// }

var started = false;
var best = 0;

var sequences = permutations(Object.keys(people));

for (var i = 0; i < sequences.length; i++) {
  var seq = sequences[i];
  var val = valueForSequence(seq);
  // console.log(val);
  if (!started || val > best) {
    best = val;
    started = true;
  }
}

function permutations(list) {
    if (list.length <= 1)
        return list.slice();

    var result = []
      , i = 0
      , resultRest
      , current
      , rest
      , j;
    for(; i<list.length; i++) {
        rest = list.slice(); // make a copy of list
        current = rest.splice(i, 1);
        permutationsRest = permutations(rest);
        for(j=0; j<permutationsRest.length; j++) {
            result.push(current.concat(permutationsRest[j]));
        }
   }
   return result;
}

function valueForSequence(seq) {
  var score = 0;
  for (var i = 0; i < seq.length; i++) {
    var name = seq[i];
    var neighbor1;
    var neighbor2;
    if (i == 0) {
      neighbor1 = seq[seq.length-1];
    } else {
      neighbor1 = seq[i-1];
    }
    if (i == seq.length -1) {
      neighbor2 = seq[0];
    } else {
      neighbor2 = seq[i+1];
    }

    score += people[name][neighbor1] + people[name][neighbor2];
  }

  return score;
}


result = best;

console.log(result);