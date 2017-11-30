var init = 20151125;
var multiplier = 252533;
var divider = 33554393;
var targetRow = 3010;
var targetCol = 3019;

var map = [];
for (var i = 0; i <= targetRow; i++) {
  map[i] = [];
}

var row = 2;
var prev = init;
while (!map[targetRow][targetCol]) {
  var r = row;
  var column = 1;
  while (r > 0) {
    var val = (prev * multiplier) % divider;
    if (!map[r]) {
      map[r] = [];
    }
    map[r][column] = val;
    prev = val;
    r--;
    column++;
  }
  row++;
}

result = map[targetRow][targetCol];

console.log(result);