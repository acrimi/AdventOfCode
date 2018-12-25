module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const nanobots = [];
  let strongest;
  const xRange = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0
  };
  const yRange = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0
  };
  const zRange = {
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
    nanobot.aabb = {
      left: nanobot.x - nanobot.r,
      right: nanobot.x + nanobot.r + 1,
      bottom: nanobot.y - nanobot.r,
      top: nanobot.y + nanobot.r + 1,
      front: nanobot.z - nanobot.r,
      back: nanobot.z + nanobot.r + 1
    };
    nanobots.push(nanobot);

    xRange.min = Math.min(xRange.min, nanobot.aabb.left);
    xRange.max = Math.max(xRange.max, nanobot.aabb.right);
    yRange.min = Math.min(yRange.min, nanobot.aabb.bottom);
    yRange.max = Math.max(yRange.max, nanobot.aabb.top);
    zRange.min = Math.min(zRange.min, nanobot.aabb.front);
    zRange.max = Math.max(zRange.max, nanobot.aabb.back);

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
    let bounds = {
      left: xRange.min,
      right: xRange.max,
      width: xRange.max - xRange.min,
      bottom: yRange.min,
      top: yRange.max,
      height: yRange.max - yRange.min,
      front: zRange.min,
      back: zRange.max,
      depth: zRange.max - zRange.min,
      overlaps: [...nanobots]
    };
    bounds.volume = bounds.width * bounds.height * bounds.depth;
    bounds.center = {
      x: bounds.left + bounds.width/2,
      y: bounds.bottom + bounds.height/2,
      z: bounds.front + bounds.depth/2
    };
    bounds.centerDistance = Math.abs(bounds.center.x) + Math.abs(bounds.center.y) + Math.abs(bounds.center.z);

    const areas = [bounds];
    
    function queueArea(area) {
      let i = 0;
      for (; i < areas.length; i++) {
        const other = areas[i];
        if (area.overlaps.length > other.overlaps.length) {
          break;
        } else if (area.overlaps.length === other.overlaps.length) {
          if (area.volume < other.volume) {
            break;
          } else if (area.volume === other.volume && area.centerDistance < other.centerDistance) {
            break;
          }
        }
      }

      areas.splice(i, 0, area);
    }

    function botOverlaps(bot, bounds) {
      // Optimistic overlap check, better to include too many bots than not enough
      let centerDistance = Math.abs(bot.x - bounds.center.x) + Math.abs(bot.y - bounds.center.y) +
        Math.abs(bot.z - bounds.center.z);
      let boundsDiagonal = (bounds.right - bounds.center.x) + (bounds.top - bounds.center.y) +
        (bounds.back - bounds.center.z);
      return centerDistance <= bot.r + boundsDiagonal;
    }

    function splitArea(area) {
      let children = [];
      let childWidth = [Math.floor(area.width/2)];
      childWidth.push(area.width - childWidth[0]);
      let childHeight = [Math.floor(area.height/2)];
      childHeight.push(area.height - childHeight[0]);
      let childDepth = [Math.floor(area.depth/2)];
      childDepth.push(area.depth - childDepth[0]);

      for (let i = 0; i < 2; i++) {
        let dx = i * childWidth[0];
        for (let j = 0; j < 2; j++) {
          let dy = j * childHeight[0];
          for (let k = 0; k < 2; k++) {
            let dz = k * childDepth[0];
            let child = {
              left: area.left + dx,
              right: area.left + dx + childWidth[i],
              width: childWidth[i],
              bottom: area.bottom + dy,
              top: area.bottom + dy + childHeight[j],
              height: childHeight[j],
              front: area.front + dz,
              back: area.front + dz + childDepth[k],
              depth: childDepth[k],
              overlaps: []
            };
            child.volume = child.width * child.height * child.depth;
            child.center = {
              x: child.left + child.width/2,
              y: child.bottom + child.height/2,
              z: child.front + child.depth/2
            };
            child.centerDistance = Math.abs(child.center.x) + Math.abs(child.center.y) + Math.abs(child.center.z);

            for (let nanobot of area.overlaps) {
              if (botOverlaps(nanobot, child)) {
                child.overlaps.push(nanobot);
              }
            }

            if (child.overlaps.length > resultCount) {
              children.push(child);
            }
          }
        }
      }

      return children;
    }

    let resultCount = 0;
    result = Number.MAX_SAFE_INTEGER;
    while (areas.length) {
      let area = areas.shift();
      if (area.volume < 10000) {
        // iterate over cells to find candidates
        let bestCount = 0;
        let bestDistance = Number.MAX_SAFE_INTEGER;
        for (let x = area.left; x < area.right; x++) {
          for (let y = area.bottom; y < area.top; y++) {
            for (let z = area.front; z < area.back; z++) {
              let count = 0;
              for (let nanobot of area.overlaps) {
                if (inRange(x, y, z, nanobot)) {
                  count++;
                }
              }
              if (count > bestCount) {
                bestCount = count;
                bestDistance = Math.abs(x) + Math.abs(y) + Math.abs(z);
              } else if (count === bestCount) {
                bestDistance = Math.min(bestDistance, Math.abs(x) + Math.abs(y) + Math.abs(z));
              }
            }
          }
        }

        if (bestCount > resultCount) {
          resultCount = bestCount;
          result = bestDistance;
        } else if (bestCount === resultCount) {
          result = Math.min(result, bestDistance);
        }
      } else {
        let children = splitArea(area);
        for (let child of children) {
          queueArea(child);
        }
      }
    }
  }

  return result;
}