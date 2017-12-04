const fs = require('fs');
const parser = require('./parser.js');

function getInput(testIndex) {
  let file = process.cwd() + '/input';
  if (testIndex) {
    file = process.cwd() + '/test'+testIndex;
  }

  if (!fs.existsSync(file) && fs.existsSync(file + '.json')) {
    return require(file + '.json');
  }

  let input = fs.readFileSync(file, 'utf8');
  
  return input;
}

function processInput(input, options) {
  if (typeof input === 'string' && options.separateLines) {
    input = parser.parse(input, options.columnDelimiter, options.lineCleanup, options.columnCleanup);
  }

  return input
}

function runTests(processor, tests, options, isPart2, fileSuffix) {
  fileSuffix = fileSuffix || '';
  const testSuffix = (isPart2 ? '-2' : '');

  if (typeof tests === 'number') {
    for (let i = 0; i < tests; i++) {
      let testInput = getInput((i+1) + fileSuffix);
      testInput = processInput(testInput, options);

      const res = processor(testInput, isPart2, true);
      console.log(`test${(i+1)}${testSuffix}:`, res);
    }
  } else if (Array.isArray(tests)) {
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      let testInput;
      let expect;

      if (typeof test === 'object' && test.input) {
        testInput = processInput(test.input, options);
        expect = test.expect;
      } else {
        testInput = processInput(tests[i], options);
      }

      const res = processor(testInput, isPart2, true);
      let outcome = '';
      if (expect) {
        outcome = (res == expect ? '-> \x1b[32mpass' : '-> \x1b[31mfail') + '\x1b[0m';
      }
      console.log(`test${(i+1)}${testSuffix}:`, res, outcome);
    }
  }
}

function loadSolution() {
  let version = '';
  const versionIndex = process.argv.indexOf(process.argv.find(v => ['-v', '--version'].indexOf(v) !== -1 )) + 1;
  if (versionIndex !== 0 && versionIndex < process.argv.length) {
    version = '-' + process.argv[versionIndex];
  }

  const solutionFile = `${process.cwd()}/solution${version}.js`;
  if (fs.existsSync(solutionFile)) {
    return require(solutionFile);
  } else {
    console.log('Solution file not found');
    process.exit();
  }
}

function loadTestConfig() {
  const testFile = process.cwd() + '/test.json';
  if (fs.existsSync(testFile)) {
    return require(testFile);
  }
}

exports.run = (options) => {
  const processor = loadSolution();
  const tests = loadTestConfig();
  const part = +process.argv[2];

  let input = options.input || getInput(null, options);
  input = processInput(input, options);

  if (part !== 2) {
    if (options.tests) {
      runTests(processor, options.tests, options);
    }
    if (tests && tests.part1) {
      runTests(processor, tests.part1, options);
    }
  }

  if (part !== 2) {
    console.log('part 1:', processor(input));
  }

  if (part !== 1) {
    if (options.tests2) {
      runTests(processor, options.tests2, options, true, '-2');
    } else if (options.tests) {
      runTests(processor, options.tests, options, true);
    }
    if (tests && tests.part2) {
      runTests(processor, tests.part2, options, true);
    }
  }

  if (part !== 1) {
    console.log('part 2:', processor(input, true));
  }
}