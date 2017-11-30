var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var lines = input.replace(/\r/g, '').split('\n');

var result = 0;

var registers = {
  a: 0,
  b: 0
};

/*
 * Uncomment for Part 2
 */
registers.a = 1;

var halve = 'hlf';
var triple = 'tpl';
var inc = 'inc';
var jump = 'jmp';
var jumpIfEven = 'jie';
var jumpIfOne = 'jio';

var mainIndex = 0;

for (; mainIndex < lines.length; mainIndex++) {
  processLine(mainIndex);
}

function processLine(index) {
  if (index < 0 || index >= lines.length) {
    return;
  }
  var line = lines[index];
  var parts = line.split(' ');

  var inst = parts[0];
  var reg = parts[1].replace(',', '');
  if (inst == halve) {
    registers[reg] = Math.floor(registers[reg]/2);
  } else if (inst == triple) {
    registers[reg] *= 3;
  } else if (inst == inc) {
    registers[reg]++;
  } else if (inst == jump) {
    var offset = parseInt(parts[1]);
    mainIndex = index + offset-1;
  } else if (inst == jumpIfEven) {
    if (registers[reg] % 2 == 0) {
      var offset = parseInt(parts[2]);
      mainIndex = index + offset-1;
    }
  } else if (inst == jumpIfOne) {
    if (registers[reg] == 1) {
      var offset = parseInt(parts[2]);
      mainIndex = index + offset-1;
    }
  } else {
    mainIndex = -2;
  }
}

result = registers.b;

console.log(result);