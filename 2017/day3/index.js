const runner = require('../../utils/runner.js');
process.chdir(__dirname);

runner.run(require('./solution.js'), {
  input: '289326',
  tests: [
    1,
    12,
    23,
    1024
  ],
  tests2: [

  ],
  separateLines: true,
  lineCleanup: true,
  columnDelimiter: false,
  columnCleanup: false
});