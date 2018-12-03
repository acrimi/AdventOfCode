module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const claimIds = {};
  const claims = {};
  const inches = {};
  const buckets = {};
  const bucketSize = 50;

  const addToBucket = (column, row, id) => {
    const key = (row << 16) + column;
    buckets[key] = [id].concat(buckets[key] || []);
  };

  const overlaps = (rect1, rect2) => {
    if (!rect1 || !rect2) {
      return false;
    }
    return rect1.left < rect2.left + rect2.width &&
      rect2.left < rect1.left + rect1.width &&
      rect1.top < rect2.top + rect2.height &&
      rect2.top < rect1.top + rect1.height;
  };

  for (let claim of input) {
    let [_, id, left, top, width, height] = claim.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);

    const rect = {
      left: +left,
      top: +top,
      width: +width,
      height: +height
    };
    
    claimIds[id] = true;
    claims[id] = rect;

    if (!isPart2) {
      for (let i = 0; i < rect.width; i++) {
        for (let j = 0; j < rect.height; j++) {
          let x = i + rect.left;
          let y = j + rect.top;

          const hash = (x << 16) + y;
          inches[hash] = (inches[hash] || 0) + 1;
        }
      }
    } else {
      let col = Math.floor(rect.left / bucketSize);
      let row = Math.floor(rect.top / bucketSize);
      let endCol = Math.floor((rect.left + rect.width) / bucketSize);
      let endRow = Math.floor((rect.top + rect.height) / bucketSize);

      for (let i = col; i <= endCol; i++) {
        for (let j = row; j <= endRow; j++) {
          addToBucket(i, j, id);
        }
      }
    }
  }

  if (!isPart2) {
    for (let inch in inches) {
      if (inches[inch] > 1) {
        result++;
      }
    }
  } else {
    for (let key in buckets) {
      let bucket = buckets[key];

      for (let i = 0; i < bucket.length; i++) {
        let id = bucket[i];
        let claim1 = claims[id];

        for (let j = i + 1; j < bucket.length; j++) {
          let id2 = bucket[j];
          if (id2 !== id) {
            let claim2 = claims[id2];

            if (overlaps(claim1, claim2)) {
              delete claimIds[id];
              delete claimIds[id2];
            }
          }
        }
      }
    }

    let ids = Object.keys(claimIds);
    if (ids.length === 1) {
      result = ids[0];
    }
  }

  return result;
}