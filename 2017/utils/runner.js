const fs = require('fs');
const parser = require(__dirname + '/./parser.js');

function getInput(testIndex, options) {
  let file = process.cwd() + '/input';
  if (testIndex) {
    file = process.cwd() + '/test'+testIndex;
  }

  if (!fs.existsSync(file) && fs.existsSync(file + '.json')) {
    return require(file + '.json');
  }

  return parser.parse(file, options.columnDelimiter, options.lineCleanUp, options.columnCleanUp);
}

function runTests(processor, tests, options, fileSuffix, isPart2) {
  fileSuffix = fileSuffix || '';
  if (typeof tests === 'number') {
    for (let i = 0; i < tests; i++) {
      const test = getInput((i+1) + fileSuffix, options);
      const res = processor(test, isPart2, true);
      console.log('test'+(i+1)+(isPart2 ? '-2' : '')+': ' + res);
    }
  } else if (Array.isArray(tests)) {
    for (let i = 0; i < tests.length; i++) {
      const res = processor([tests[i]], isPart2, true);
      console.log('test'+(i+1)+(isPart2 ? '-2' : '')+': ' + res);
    }
  }
}

exports.run = (processor, options) => {
  options.input = options.input || getInput(null, options);

  const part = +process.argv[2];

  if (part !== 2 && options.tests) {
    runTests(processor, options.tests, options);
  }

  if (part !== 2) {
    console.log('part 1:', processor(options.input));
  }

  if (part !== 1) {
    if (options.tests2) {
      runTests(processor, options.tests2, options, '-2', true);
    } else if (options.tests) {
      runTests(processor, options.tests, options, '', true);
    }
  }

  if (part !== 1) {
    console.log('part 2:', processor(options.input, true));
  }
}