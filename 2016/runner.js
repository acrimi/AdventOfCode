var fs = require('fs');
var parser = require('./parser.js');


function getInput(testIndex, columnDelimiter, lineCleanUp, columnCleanUp) {
  var file = process.cwd() + '/input';
  if (testIndex) {
    file = process.cwd() + '/test'+testIndex;
  }

  if (!fs.existsSync(file) && fs.existsSync(file + '.json')) {
    return require(file + '.json');
  }

  return parser.parse(file, columnDelimiter, lineCleanUp, columnCleanUp);
}



exports.run = function(input, processor, tests, columnDelimiter, lineCleanUp, columnCleanUp) {
  if (typeof input === 'function') {
    columnCleanUp = lineCleanUp;
    lineCleanUp = columnDelimiter;
    columnDelimiter = tests;
    tests = processor;
    processor = input;
    input = null;
  }

  if (tests) {
    if (typeof tests === 'number') {
      for (var i = 0; i < tests; i++) {
        var test = getInput(i+1, columnDelimiter, lineCleanUp, columnCleanUp);
        var res = processor(test, true);
        console.log('test'+(i+1)+': ' + res);
      }
    } else if (Array.isArray(tests)) {
      for (var i = 0; i < tests.length; i++) {
        var res = processor([tests[i]], true);
        console.log('test'+(i+1)+': ' + res);
      }
    }
  }

  input = input ? [input] : getInput(null, columnDelimiter, lineCleanUp, columnCleanUp);
  var res = processor(input);
  console.log('result: ' + res);
}