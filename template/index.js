const runner = require('../utils/runner.js');
process.chdir(__dirname);

runner.run(require('./solution.js'), {
  input: null,
  tests: [

  ],
  tests2: [

  ],
  separateLines: true,
  lineCleanup: true,
  columnDelimiter: false,
  columnCleanup: false
});