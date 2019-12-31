# AdventOfCode
Solutions to [Advent of Code](http://adventofcode.com/) problems using node.js 10+

## Usage

### 2015-2016
Implementation varies, but generally run in the directory of the desired day with:  

```
$ node advent.js
```

### 2017-
Each day can be run as a standard node module:

```
$ node ./<year>/dayX [<part>] [<option>...]
```

Where `part` is an optional number, 1 or 2, to run only a single part of the problem. If omitted, both parts will be executed. The following options may also be specified:

- `-v | --version <version>`: Will attempt to run a non-default solution by appending `version` preceded by a dash to the solution file name. For example, specifying `-v regex` will attempt to run `solution-regex.js`.

- `-s | --submit`: Will automatically submit the answer returned by your solution to the AoC API. Only takes effect when executing a single part of the problem. API access must be set up as detailed below.

- `-t | --test-strict`: When used in conjunction with `--submit`, requires that all test cases are passing before submitting the answer to the AoC API. Only applies to test cases in `test.json` that contain an `expect` value (see the [Chrome extension README](https://github.com/acrimi/AdventOfCode/blob/master/extension/README.md)). Manually specified test inputs and test cases without an `expect` value are considered passing by default.

- `-p | --profile`: Will profile your solution and log out the time it takes to run, in milliseconds, alongside the result.

The input for each day can be specified in the config object in the `index.js` file or an `input` file in the day's directory. If no input is given and API access is setup (see below), the input will be downloaded and cached from the AoC website automatically.

Test inputs can be specified for each part in the config object in the day's `index.js` file as either arrays of input values or as numbers. If specified as a number, the script will consider it a count of indexed files in the day directory, each containing a single test input value (`/dayX/test1`, `/dayX/test2`,... for part 1; `/dayX/test1-2`, `/dayX/test2-2`,... for part 2). However, the preferred method for adding tests is adding them as test cases to a `test.json` file in the day's directory, usually in conjunction with the [Chrome extension](https://github.com/acrimi/AdventOfCode/blob/master/extension)).

## Setup
To set up the stub files for a new day, run:

```
$ ./init <year> <dayNumber>
```

## API Access
To make use of Advent of Code API integration (downloading input automatically, using `--submit` option), save your session token either in the `AOC_SESSION` environment variable or a `session.txt` file in the root directory of this project. This should be the session cookie saved for the `.adventofcode.com` domain when you log in to the AoC website.
