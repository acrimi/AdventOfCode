const runner = require('../utils/runner.js');
process.chdir(__dirname);

runner.run(require('./solution.js'), {
  input: null,
  tests: [

  ],
  tests2: [

  ],
  columnDelimiter: false,
  lineCleanup: true,
  columnCleanup: false
});