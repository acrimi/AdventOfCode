module.exports = (input, isPart2, isTest) => {
  let result = 0;
  
  const serial = +input;

  const getPower = (x, y) => {
    let id = x + 10;
    let power = Math.floor(((((id * y) + serial) * id) / 100) % 10 - 5);
    return power;
  };

  const calculateAreaPower = (x, y, size) => {
    let power = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        power += getPower(x + i, y + j);
      }
    }
    return power;
  }

  const maxPowerForSize = (size) => {
    let maxPower = null;
    let xyPair = null;
    for (let x = 1; x <= 300 - (size - 1); x++) {
      for (let y = 1; y <= 300 - (size - 1); y++) {
        power = calculateAreaPower(x, y, size);
        if (maxPower === null || power > maxPower) {
          maxPower = power;
          xyPair = `${x},${y}`;
        }
      }
    }

    return {maxPower, xyPair};
  }

  if (!isPart2) {
    result = maxPowerForSize(3).xyPair
  } else {
    let bestArea = null;
    let size = 0;
    for (let i = 5; i <= 20; i++) {
      let area = maxPowerForSize(i);
      if (bestArea === null || area.maxPower > bestArea.maxPower) {
        bestArea = area;
        size = i;
      }
    }

    result = `${bestArea.xyPair},${size}`;
  }

  return result;
}