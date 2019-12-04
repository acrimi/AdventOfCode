const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

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
        if (input.trim() == '404 Not Found' || input.includes('Please don\'t repeatedly request this endpoint before it unlocks')) {
          console.log('Input not available');
          process.exit();
        }
        resolve(input.trim());
      });
    });
  });
};

exports.submit = (year, day, part, answer) => {
  const session = process.env.AOC_SESSION || loadSessionFromFile();
  if (!session) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const data = querystring.stringify({
      level: part,
      answer: answer
    });

    const req = https.request({
      method: 'POST',
      hostname: 'adventofcode.com',
      path: `/${year}/day/${day}/answer`,
      headers: {
        cookie: 'session='+session,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let response = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        response += chunk;
      });

      res.on('end', () => {
        let message = response.match(/<article><p>([\s\S]*)<\/p><\/article>/);
        if (message) {
          message = message[1].replace(/<[^>]+>/g, '');
          console.log(message);
        } else {
          console.log('Unparseable response for answer');
        }
        resolve();
      });
    });

    req.write(data);
    req.end();
  });
}