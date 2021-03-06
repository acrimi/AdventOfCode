const IntcodeComputer = require('../intcode');
const ascii = require('../ascii');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
});

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const automatePlayer = true; // change to false to play the game manually 
  let lastOutput = '';
  const comp = new IntcodeComputer(input);

  const runCommands = () => {
    const output = comp.execute(null, true).value;
    if (!automatePlayer) {
      console.log(ascii.fromAscii(output));
    }
    lastOutput = ascii.fromAscii(output);
    if (lastOutput.includes('keypad')) {
      result = +lastOutput.match(/\d+/)[0];
      return;
    }
    if (!automatePlayer) {
      readline.prompt();
    }
  };

  readline.on('line', line => {
    comp.pushInput(ascii.toAscii(line + '\n'));
    runCommands();
  });
  runCommands();

  if (automatePlayer) {
    const items = [
      'asterisk', 'ornament', 'cake', 'space heater', 'festive hat',
      'semiconductor', 'food ration', 'sand' 
    ];
    const itemCombinations = [];
    const getCombinations = function(set, addends) {
      for (var i = 0; i < addends.length; i++) {
        itemCombinations.push(set.concat(addends[i]));
        getCombinations(set.concat(addends[i]), addends.slice(i + 1));
      }
    };
    getCombinations([], items);
    const searchCommands = [
      'north', 'take sand', 'north', 'take space heater', 'east',
      'take semiconductor', 'west', 'south', 'south', 'east', 'take ornament',
      'south', 'take festive hat', 'east', 'take asterisk', 'south',
      'west', 'take food ration', 'east', 'east', 'take cake', 'west',
      'north', 'west', 'north', 'west', 'west', 'north', 'north'
    ];
    for (let i = 0; i < searchCommands.length; i++) {
      searchCommands[i] = ascii.toAscii(searchCommands[i] + '\n');
    }
    const dropCommands = [];
    for (let item of items) {
      dropCommands.push(ascii.toAscii(`drop ${item}\n`));
    }
  
    const dropAll = () => {
      for (let command of dropCommands) {
        comp.pushInput(command);
        runCommands();
      }
    };
  
    const takeItems = (items) => {
      for (let item of items) {
        comp.pushInput(ascii.toAscii(`take ${item}\n`));
        runCommands();
      }
    };
    for (let command of searchCommands) {
      comp.pushInput(command);
      runCommands();
    }
    for (let combo of itemCombinations) {
      dropAll();
      takeItems(combo);
      comp.pushInput(ascii.toAscii('west\n'));
      runCommands();
      if (result !== 0) {
        readline.close();
        break;
      }
    }
  }

  return result;
}