module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const nanobots = [];
  let strongest;
  const xAxis = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0
  };
  const yAxis = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0
  };
  const zAxis = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0
  };

  for (let row of input) {
    let [_, x, y, z, r] = row.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/);
    let nanobot = {
      x: +x,
      y: +y,
      z: +z,
      r: +r
    };
    nanobots.push(nanobot);

    xAxis.min = Math.min(xAxis.min, nanobot.x);
    xAxis.max = Math.max(xAxis.max, nanobot.x);
    yAxis.min = Math.min(yAxis.min, nanobot.y);
    yAxis.max = Math.max(yAxis.max, nanobot.y);
    zAxis.min = Math.min(zAxis.min, nanobot.z);
    zAxis.max = Math.max(zAxis.max, nanobot.z);

    if (!strongest || strongest.r < nanobot.r) {
      strongest = nanobot;
    }
  }

  function distance(bot1, bot2) {
    return Math.abs(bot1.x - bot2.x) +
      Math.abs(bot1.y - bot2.y) +
      Math.abs(bot1.z - bot2.z);
  }

  function inRange(x, y, z, bot2) {
    let distance = Math.abs(x - bot2.x) +
      Math.abs(y - bot2.y) +
      Math.abs(z - bot2.z);
    return distance <= bot2.r;
  }

  if (!isPart2) {
    for (let nanobot of nanobots) {
      if (distance(nanobot, strongest) <= strongest.r) {
        result++;
      }
    }
  } else {
    let maxCount = 0;
    let distanceFromOrigin = Number.MAX_SAFE_INTEGER;
    for (let x2 = xAxis.min; x2 <= xAxis.max; x2++) {
      for (let y2 = yAxis.min; y2 <= yAxis.max; y2++) {
        for (let z2 = zAxis.min; z2 <= zAxis.max; z2++) {
          let count = 0;
          for (let nanobot of nanobots) {
            if (inRange(x2, y2, z2, nanobot)) {
              count++;
            }
          }

          if (count === maxCount) {
            let dist = Math.abs(x2) + Math.abs(y2) + Math.abs(z2);
            distanceFromOrigin = Math.min(dist, distanceFromOrigin);
          } else if (count > maxCount) {
            maxCount = count;
            distanceFromOrigin = Math.abs(x2) + Math.abs(y2) + Math.abs(z2);
          }
        }
      }
    }

    result = distanceFromOrigin;
  }

  return result;
}