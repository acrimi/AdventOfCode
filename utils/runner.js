const fs = require('fs');

const api = require('./api.js');
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
  let passing = true;

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

      if (typeof test === 'object' && test.input != null) {
        testInput = processInput(test.input, options);
        expect = test.expect;
      } else {
        testInput = processInput(tests[i], options);
      }

      const res = processor(testInput, isPart2, true);
      let outcome = '';
      if (expect != null) {
        passing = passing && res == expect;
        outcome = (res == expect ? '-> \x1b[32mpass' : '-> \x1b[31mfail') + '\x1b[0m';
      }
      console.log(`test${(i+1)}${testSuffix}:`, res, outcome);
    }
  }

  return passing;
}

exports.run = async (options) => {
  const processor = loader.loadSolution();
  const tests = loader.loadTestConfig();
  const part = +process.argv[2];
  const autoSubmit = !!process.argv.find(x => /-s|--submit/.test(x));
  const requirePass = !!process.argv.find(x => /-r|--require-pass/.test(x));

  const pathMatch = process.cwd().match(/(\d{4})\/day(\d+)$/);
  const year = pathMatch[1];
  const day = pathMatch[2];

  let input = options.input || await loader.loadInput();
  input = processInput(input, options);

  let p1TestsPass = true;
  if (part !== 2) {
    if (options.tests) {
      p1TestsPass = p1TestsPass && await runTests(processor, options.tests, options);
    }
    if (tests && tests.part1) {
      p1TestsPass = p1TestsPass && await runTests(processor, tests.part1, options);
    }
  }

  if (part !== 2) {
    const answer = processor(input);
    console.log('part 1:', answer);
    if (part === 1 && autoSubmit && (!requirePass || p1TestsPass)) {
      await api.submit(year, day, part, answer);
    }
  }

  let p2TestsPass = true;
  if (part !== 1) {
    if (options.tests2) {
      p2TestsPass = p2TestsPass && await runTests(processor, options.tests2, options, true, '-2');
    } else if (options.tests) {
      p2TestsPass = p2TestsPass && await runTests(processor, options.tests, options, true);
    }
    if (tests && tests.part2) {
      p2TestsPass = p2TestsPass && await runTests(processor, tests.part2, options, true);
    }
  }

  if (part !== 1) {
    const answer = processor(input, true);
    console.log('part 2:', answer);
    if (part === 2 && autoSubmit && (!requirePass || p2TestsPass)) {
      await api.submit(year, day, part, answer);
    }
  }
};