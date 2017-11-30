const runner = require(__dirname + '/../utils/runner.js');
process.chdir(__dirname);

runner.run(require(__dirname + '/solution.js'), {
  input: null,
  tests: [

  ],
  tests2: [

  ],
  columnDelimiter: false,
  lineCleanup: true,
  columnCleanup: false
});