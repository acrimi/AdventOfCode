module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const guards = {};
  const shifts = {};

  for (let event of input) {
    let [_, month, day, hour, minute, msg, id] = event.match(/\[\d+-(\d+)-(\d+) (\d+):(\d+)\] (Guard #(\d+) begins shift|wakes up|falls asleep)/);
    month = +month;
    day = +day;
    hour = +hour;
    minute = +minute;
    id = +id;

    if (id && hour !== 0) {
      day++; // advance to midnight
      if (day == 32) {
        month++;
        day = 1;
      } else if (day == 31 && [4, 6, 9, 11].includes(month)) {
        month++;
        day = 1;
      } else if (day == 29 && month == 2) {
        month++;
        day = 1;
      }
    }
    
    let date = `${month}${day}`;
    let shift = shifts[date] || {};
    shifts[date] = shift;

    if (!id) {
      shift.times = (shift.times || []).concat(minute);
    } else {
      shift.id = id;
      let guard = guards[id] = (guards[id] || {
        id: id,
        minutes: {},
        shifts: []
      });
      guard.shifts.push(date);
    }
  }

  for (let date in shifts) {
    let shift = shifts[date];
    if (!shift.times) {
      continue;
    }
    let guard = guards[shift.id];

    let minutesAsleep = 0;
    shift.times.sort((a, b) => a - b);

    let asleep = false;
    let lastTime = 0;
    for (let time of shift.times) {
      if (asleep) {
        minutesAsleep += time - lastTime;
        for (let i = lastTime; i < time; i++) {
          guard.minutes[i] = (guard.minutes[i] || 0) + 1;
        }
      } else {
        lastTime = time;
      }
      asleep = !asleep;
    }

    guard.minutesAsleep = (guard.minutesAsleep || 0) + minutesAsleep;
    shift.minutesAsleep = minutesAsleep;
  }
  
  if (!isPart2) {
    let maxTime = 0;
    let targetId = -1;
    for (let id in guards) {
      let guard = guards[id];
      if (guard.minutesAsleep > maxTime) {
        maxTime = guard.minutesAsleep;
        targetId = id;
      }
    }

    let targetGuard = guards[targetId];
    let maxCount = 0;
    let targetMinute = -1;
    for (let minute in targetGuard.minutes) {
      let count = targetGuard.minutes[minute];
      if (count > maxCount) {
        maxCount = count;
        targetMinute = minute;
      }
    }

    result = targetGuard.id * targetMinute;
  } else {
    let maxCount = 0;
    let targetGuardId = -1;
    let targetMinute = -1;
    for (let id in guards) {
      let guard = guards[id];
      for (let minute in guard.minutes) {
        let count = guard.minutes[minute];
        if (count > maxCount) {
          maxCount = count;
          targetGuardId = id;
          targetMinute = minute;
        }
      }
    }

    result = targetGuardId * targetMinute;
  }

  return result;
}