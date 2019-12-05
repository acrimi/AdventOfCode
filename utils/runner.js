const fs = require('fs');

const api = require('./api.js');
const loader = require('./loader.js');
const parser = require('./parser.js');

function logResult(answer, part, isTest, testNumber, passed, profileTime) {
  if (typeof isTest === 'number') {
    profileTime = isTest;
    isTest = testNumber = passed = undefined;
  }
  if (typeof pass === 'number') {
    profileTime = pass;
    passed = undefined;
  }

  let msg = answer;

  if (isTest) {
    let label = 'test' + testNumber;
    if (part === 2) {
      label += '-2';
    }
    msg = label + ': ' + msg;

    if (passed != null) {
      msg += (passed ? '-> \x1b[32mpass' : '-> \x1b[31mfail') + '\x1b[0m';
    }
  } else {
    msg = `part ${part}: ${msg}`;
  }

  if (typeof profileTime === 'number') {
    msg += ` \x1b[33m(${profileTime}ms)\x1b[0m`;
  }

  console.log(msg);
}

function processInput(input, options) {
  if (typeof input === 'string' && options.separateLines) {
    input = parser.parse(input, options.columnDelimiter, options.lineCleanup, options.columnCleanup);
  }

  return input;
}

async function runTests(processor, tests, options, isPart2, fileSuffix) {
  fileSuffix = fileSuffix || '';
  let passing = true;

  if (typeof tests === 'number') {
    for (let i = 0; i < tests; i++) {
      let testInput = await loader.loadInput((i+1) + fileSuffix);
      testInput = processInput(testInput, options);

      const start = Date.now();
      const res = processor(testInput, isPart2, true, i + 1);
      const runTime = Date.now() - start;
      logResult(res, isPart2 ? 2 : 1, true, i + 1, options.profile && runTime);
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

      const start = Date.now();
      const res = processor(testInput, isPart2, true, i + 1);
      const runTime = Date.now() - start;
      if (expect != null) {
        passing = passing && res == expect;
      }
      logResult(res, isPart2 ? 2 : 1, true, i + 1, res == expect, options.profile && runTime);
    }
  }

  return passing;
}

exports.run = async (options) => {
  const processor = loader.loadSolution();
  const tests = loader.loadTestConfig();
  const part = +process.argv[2];
  const autoSubmit = !!process.argv.find(x => /-[tp]*?s|--submit/.test(x));
  const requirePass = !!process.argv.find(x => /-[sp]*?t|--test-strict/.test(x));
  const profile = options.profile = !!process.argv.find(x => /-[st]*?p|--profile/.test(x));

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
    if (Array.isArray(input)) {
      input = input.concat([]);
    }
    const start = Date.now();
    const answer = processor(input);
    const runTime = Date.now() - start;
    logResult(answer, 1, profile && runTime);
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
    const start = Date.now();
    const answer = processor(input, true);
    const runTime = Date.now() - start;
    logResult(answer, 2, profile && runTime);
    if (part === 2 && autoSubmit && (!requirePass || p2TestsPass)) {
      await api.submit(year, day, part, answer);
    }
  }
};