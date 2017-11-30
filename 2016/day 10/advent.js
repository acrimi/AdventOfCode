var runner = require('../runner.js');

runner.run(function(input, isTest) {
  var result = 0;

  var part2 = false;

  var bots = {};
  var outputs = {};
  
  for (var i = 0; i < input.length; i++) {
    var line = input[i];

    if (/^value/.test(line)) {
      line.replace(/^value (\d+) goes to bot (\d+)/, function(match, value, botNo) {
        var bot = bots[botNo] = bots[botNo] || {chips: []};
        bot.chips.push(parseInt(value));
      });
    }
  }

  while (input.length && !result) {
    for (var i = 0; i < input.length; i++) {
      var line = input[i];
      var processed = false;

      if (/^bot/.test(line)) {
        line.replace(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/, function(match, botNo, lowType, lowNo, highType, highNo) {
          var bot = bots[botNo] = (bots[botNo] || {chips: []});
          if (bot.chips.length < 2) {
            return;
          }
          
          if (!part2 && bot.chips.indexOf(17) >= 0 && bot.chips.indexOf(61) >= 0) {
            result = botNo;
            return;
          }

          var low = Number.MAX_VALUE;
          var high = 0;

          for (var j = 0; j < bot.chips.length; j++) {
            low = Math.min(parseInt(bot.chips[j]), low);
            high = Math.max(parseInt(bot.chips[j]), high);
          }

          var lowTarget = lowType === 'bot' ? bots : outputs;
          var highTarget = highType === 'bot' ? bots: outputs;

          (lowTarget[lowNo] = lowTarget[lowNo] || {chips:[]}).chips.push(low);
          (highTarget[highNo] = highTarget[highNo] || {chips:[]}).chips.push(high);

          bot.chips.splice(bot.chips.indexOf(low), 1);
          bot.chips.splice(bot.chips.indexOf(high), 1);
          processed = true;
        });
      } else {
        processed = true;
      }

      if (result) {
        break;
      }

      if (processed) {
        input.splice(i, 1);
        i--;
      }
    }
  }

  if (part2) {
    result = outputs[0].chips[0] * outputs[1].chips[0] * outputs[2].chips[0];
  }


  return result;
},
[

], 
false, true, false);

