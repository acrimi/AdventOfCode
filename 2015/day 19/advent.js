var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var lines = input.replace(/\r/g, '').split('\n');

var result = 0;

var input;
var replacements = {};
var combinations = {};

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var parts = line.split(' ');

  if (line.indexOf('=>') > 0) {
    var name = parts[0];
    replacements[name] = replacements[name] || [];
    replacements[name].push(parts[2]);
  } else if (line.length > 2) {
    input = line;
  }
}

/*
 * Uncomment for Part 1
 */
// for (var i = 0; i < input.length; i++) {
//   var el = input[i];
//   if (i < input.length-1 && /[a-z]/.test(input[i+1]) && input[i+1] != 'e') {
//     el += input[i+1];
//     i++;
//   }

//   var list = replacements[el];
//   if (list) {
//     for (var j = 0; j < list.length; j++) {
//       var rep = list[j];
//       var end = el.length == 2 ? i-1 : i;
//       var mol = input.substring(0, end) + rep + input.substring(i+1);
//       combinations[mol] = true;
//     }
//   }
// }

// result = Object.keys(combinations).length;

/*
 * Uncomment for Part 2
 */
// result = getFewestSteps(input, 0);

// function getFewestSteps(seed, currentSteps) {
//   var best = -1;

//   for (var key in replacements) {
//     var list = replacements[key];
//     for (var i = 0; i < list.length; i++) {
//       var rep = list[i];
//       if (seed.indexOf(rep) >= 0) {
//         var temp = seed.replace(rep, key);
//         if (temp == 'e') {
//           console.log('e in ' + (currentSteps+1));
//           return 1;
//         } else {
//           var steps = getFewestSteps(temp, currentSteps+1);
//           if (steps != -1 && (best < 0 || 1+steps < best)) {
//             best = 1 + steps;
//           }
//         }
//       }
//     }
//   }

//   return best;
// }

console.log(result);