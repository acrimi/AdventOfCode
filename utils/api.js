const fs = require('fs');
const https = require('https');

function loadSessionFromFile() {
  const path = __dirname + '/../session.txt';
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf8');
  }
}

exports.getInput = (year, day) => {
  const session = process.env.AOC_SESSION || loadSessionFromFile();
  if (!session) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    https.get({
      hostname: 'adventofcode.com',
      path: `/${year}/day/${day}/input`,
      headers: {
        cookie: 'session='+session
      }
    }, res => {
      let input = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        input += chunk;
      });

      res.on('end', () => {
        if (input.match(/Please log in/)) {
          console.log('Unable to get input, please set your session token in ./session.txt or AOC_SESSION');
          process.exit();
        }
        resolve(input);
      });
    });
  });
}