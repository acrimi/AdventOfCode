var parser = require('../parser.js');

var input = parser.parse(__dirname + '/input');

var result = 0;

// Part 1
// var buttons = [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9]
// ];

// var row = 1,
//     column = 1;

// Part 2
var buttons = [
  [null, null, 1, null, null],
  [null, 2,3,4, null],
  [5,6,7,8,9],
  [null,'A','B','C',null],
  [null,null,'D',null,null]
];

var row = 2,
    column = 0;

var code = "";

for (var i = 0; i < input.length; i++) {
  var dir = input[i];
  for (var j = 0; j < dir.length; j++) {
    var c = dir.charAt(j);
    if (c == 'U' && buttons[row-1] && buttons[row-1][column]) {
      row--;
    } else if (c == 'D' && buttons[row+1] && buttons[row+1][column]) {
      row++;
    } else if (c == 'R' && buttons[row][column+1]) {
      column++;
    } else if (c == 'L' && buttons[row][column-1]) {
      column--;
    }
  }

  if (buttons[row] && buttons[row][column]) {
    code += buttons[row][column];
  }
}

result = code;

console.log(result);
