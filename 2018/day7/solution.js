module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const steps = {};
  const workers = isTest ? 2 : 5;
  const baseTime = isTest ? 0 : 60;
  const A = 'A'.charCodeAt(0);
  const workQueues = [];
  for (let i = 0; i < workers; i++) {
    workQueues[i] = {
      timeRemaining: 0
    };
  }
  let totalTime = 0;

  for (let instruction of input) {
    let [_, reqName, stepName] = instruction.match(/Step (.) must be finished before step (.) can begin/);
    let step = steps[stepName] = steps[stepName] || {
      requirements: [],
      next: [],
      time: baseTime + stepName.charCodeAt(0) - A + 1
    };
    let requirement = steps[reqName] = steps[reqName] || {
      requirements: [],
      next: [],
      time: baseTime + reqName.charCodeAt(0) - A + 1
    };

    step.requirements.push(reqName);
    requirement.next.push(stepName)
  }

  let order = [];

  while (Object.keys(steps).length > 0) {
    let nextSteps = [];
    let minWorkTime = Number.MAX_SAFE_INTEGER;
    stepLoop:
    for (let key in steps) {
      let step = steps[key];
      for (let req of step.requirements) {
        if (!order.includes(req)) {
          // step cannot be performed yet
          continue stepLoop;
        }
      }

      nextSteps.push(key);
    }

    nextSteps.sort();
    if (!isPart2) {
      if (nextSteps.length > 0) {
        let nextStep = nextSteps[0];
        order.push(nextStep);
        delete steps[nextStep];
      }
    } else {
      for (let queue of workQueues) {
        if (queue.timeRemaining <= 0 && nextSteps.length > 0) {
          let key = nextSteps.shift();
          queue.step = key;
          queue.timeRemaining = steps[key].time;
          delete steps[key];
        }
        minWorkTime = queue.timeRemaining > 0 ? Math.min(queue.timeRemaining, minWorkTime) : minWorkTime;
      }
    
      totalTime += minWorkTime;
      for (let queue of workQueues) {
        queue.timeRemaining -=  minWorkTime;
        if (queue.timeRemaining <= 0) {
          queue.timeRemaining = 0;
          order.push(queue.step);
        }
      }
    }
  }

  result = isPart2 ? totalTime : order.join('');

  return result;
}