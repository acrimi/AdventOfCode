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

  const key = `part${data.part}`;
  const tests = testData[key] || [];
  testData[key] = tests;

  if (data.input) {
    tests.push({
      input: data.input
    });
  } else if (data.expect) {
    if (data.part === 2 && tests.length === 0 && testData.part1 && testData.part1.length === 1) {
      // No part2 data exists, part 1 has one test case, reuse input
      // For common scenario where both parts have same test input but different results
      tests.push({
        input: testData.part1[0].input,
        expect: data.expect
      });
    } else {
      for (let test of tests) {
        if (!test.expect) {
          test.expect = data.expect;
          break;
        }
      }
    }
  }

  fs.writeFileSync(testFile, JSON.stringify(testData, null, 2));
});