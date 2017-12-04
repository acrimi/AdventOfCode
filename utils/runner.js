const fs = require('fs');

const loader = require('./loader.js');
const parser = require('./parser.js');

function processInput(input, options) {
  if (typeof input === 'string' && options.separateLines) {
    input = parser.parse(input, options.columnDelimiter, options.lineCleanup, options.columnCleanup);
  }

  return input;
}

async function runTests(processor, tests, options, isPart2, fileSuffix) {
  fileSuffix = fileSuffix || '';
  const testSuffix = (isPart2 ? '-2' : '');

  if (typeof tests === 'number') {
    for (let i = 0; i < tests; i++) {
      let testInput = await loader.loadInput((i+1) + fileSuffix);
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

exports.run = async (options) => {
  const processor = loader.loadSolution();
  const tests = loader.loadTestConfig();
  const part = +process.argv[2];

  let input = options.input || await loader.loadInput();
  input = processInput(input, options);

  if (part !== 2) {
    if (options.tests) {
      await runTests(processor, options.tests, options);
    }
    if (tests && tests.part1) {
      await runTests(processor, tests.part1, options);
    }
  }

  if (part !== 2) {
    console.log('part 1:', processor(input));
  }

  if (part !== 1) {
    if (options.tests2) {
      await runTests(processor, options.tests2, options, true, '-2');
    } else if (options.tests) {
      await runTests(processor, options.tests, options, true);
    }
    if (tests && tests.part2) {
      await runTests(processor, tests.part2, options, true);
    }
  }

  if (part !== 1) {
    console.log('part 2:', processor(input, true));
  }
};