var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var result = 0;

var facts = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

var moreThan = ['cats', 'trees'];
var lessThan = ['pomeranians', 'goldfish'];

for (var key in facts) {
  input = input.replace(new RegExp(key, 'g'), '"'+key+'"');
}

var lines = input.split('\n');

var possibleSues = [];

for (var i = 0; i < lines.length; i++) {
  var items = lines[i].replace(/Sue \d+:/, '');
  var sue = JSON.parse('{'+items+'}');
  var uncertain = false;
  var negative = false;

  for (var key in facts) {
    var pass = facts[key] === sue[key];
    /*
     * Uncomment for Part 2
     */
    // if (moreThan.indexOf(key) >= 0) {
    //   pass = sue[key] > facts[key];
    // } else if (lessThan.indexOf(key) >= 0) {
    //   pass = sue[key] < facts[key];
    // }
    if (!pass) {
      if (key in sue) {
        negative = true;
        break;
      } else {
        uncertain = true;
      }
    }
  }

  if (!negative) {
    if (!uncertain) {
      possibleSues = [i+1];
      break;
    } else {
      possibleSues.push(i+1);
    }
  }
}

result = possibleSues;

console.log(result);