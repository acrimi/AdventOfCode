const runner = require('../../utils/runner.js');
process.chdir(__dirname);

runner.run({
  input: null,
  tests: [

  ],
  tests2: [

  ],
  separateLines: true,
  lineCleanup: l => +(l.trim()),
  columnDelimiter: false,
  columnCleanup: false
});