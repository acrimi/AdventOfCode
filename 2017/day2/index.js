const runner = require('../../utils/runner.js');
process.chdir(__dirname);

runner.run(require('./solution.js'), {
  input: null,
  tests: 1,
  tests2: 1,
  separateLines: true,
  lineCleanup: true,
  columnDelimiter: ' ',
  columnCleanup: true
});