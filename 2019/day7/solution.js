const intcode = require('../intcode');

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const phases = 5;
  const phaseSettings = []
  const minPhase = isPart2 ? 5 : 0;
  const numAmplifiers = 5;
  const amplifierQueues = [];
  const amplifiers = [];

  for (let a = 0; a < phases; a++) {
    phaseSettings.push(a + minPhase);
    for (let b = 0; b < phases; b++) {
      if (b == a) continue;
      phaseSettings.push(b + minPhase);
      for (let c = 0; c < phases; c++) {
        if (c == a || c == b) continue;
        phaseSettings.push(c + minPhase);
        for (let d = 0; d < phases; d++) {
          if (d == a || d == b || d == c) continue;
          phaseSettings.push(d + minPhase);
          for (let e = 0; e < phases; e++) {
            if (e == a || e == b || e == c || e == d) continue;
            phaseSettings.push(e + minPhase);

            for (let i = 0; i < numAmplifiers; i++) {
              amplifiers[i] = new intcode(input);
              amplifierQueues[i] = [phaseSettings[i]];
            }
            amplifierQueues[0].push(0);

            let finalOutput;
            loop:
            while (true) {
              for (let i = 0; i < amplifierQueues.length; i++) {
                const queue = amplifierQueues[i];
                const comp = amplifiers[i];
                while (queue.length > 0) {
                  const output = comp.execute(queue.shift());
                  if (output.done) {
                    break;
                  } else if (output.value) {
                    if (i === amplifierQueues.length - 1) {
                      finalOutput = output.value;
                      if (isPart2) {
                        amplifierQueues[0].push(output.value);
                      }
                    } else {
                      amplifierQueues[i + 1].push(output.value);
                    }
                  }
                }

                if (amplifierQueues.map(q => q.length).reduce((a, b) => a + b) == 0) {
                  break loop;
                }
              }
            }

            if (finalOutput != null) {
              result = Math.max(result, finalOutput);
            }

            phaseSettings.pop();
          }
          phaseSettings.pop();
        }
        phaseSettings.pop();
      }
      phaseSettings.pop();
    }
    phaseSettings.pop();
  }

  return result;
}