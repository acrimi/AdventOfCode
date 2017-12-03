#! /usr/bin/env node
"use strict";

const fs = require('fs');

let first = true;
let buffers = [];
process.stdin.on('readable', () => {
  let chunk;
  while (null !== (chunk = process.stdin.read())) {
    if (first) {
      chunk = chunk.slice(4);
      first = false;
    }
    buffers.push(chunk);
  }
  const str = Buffer.concat(buffers);
  const data = JSON.parse(str);

  const testFile = `${__dirname}/../../${data.year}/day${data.day}/test.json`;
  let testData = {};
  if (fs.existsSync(testFile)) {
    testData = require(testFile);
  }

  // TODO update testData

  fs.writeFileSync(testFile, testData);
});