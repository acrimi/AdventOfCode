# AdventOfCode
Solutions to [Advent of Code](http://adventofcode.com/) problems using node.js 8

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

Where `part` is an optional number, 1 or 2, to run only a single part of the problem. The following options may also be specified:

- `-v | --version <version>`: Will attempt to run a non-default solution by appending `version` preceded by a dash to the solution file name. For example, specifying `-v regex` will attempt to run `solution-regex.js`.

## Setup
To set up the stub files for a new day, run:

```
$ ./init <year> <dayNumber>
```

## API Access
To make use of the Advent of Code API integration (eg downloading input automatically), save your session token either in the `AOC_SESSION` environment variable or a `session.txt` file in the root directory. This should be the session cookie saved for the `.adventofcode.com` domain when you log in to the website.
