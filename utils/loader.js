const fs = require('fs');

const api = require('./api.js');

exports.loadInput = async (testIndex, skipCache) => {
  if (typeof testIndex == 'boolean') {
    skipCache = testIndex;
    testIndex = undefined;
  }
  let file = process.cwd() + '/input';
  if (testIndex) {
    file = process.cwd() + '/test'+testIndex;
  }

  let input;
  if (fs.existsSync(file) && (testIndex || !skipCache)) {
    input = fs.readFileSync(file, 'utf8');
  } else {
    if (fs.existsSync(file + '.json')) {
      input = require(file + '.json');
    } else if (!testIndex) {
      const pathMatch = process.cwd().match(/(\d{4})\/day(\d+)$/);
      const year = pathMatch[1];
      const day = pathMatch[2];
      input = await api.getInput(year, day);

      fs.writeFileSync(file, input);
    }
  }

  return input;
};

exports.loadSolution = () => {
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
};

exports.loadTestConfig = () => {
  const testFile = process.cwd() + '/test.json';
  if (fs.existsSync(testFile)) {
    return require(testFile);
  }
};