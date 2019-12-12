function gcd(a, b) {
  if (b == 0) {
      return a;
  }

  return gcd(b, a % b);
}

function lcm(...numbers) {
  let multiple = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    multiple = multiple * numbers[i] / gcd(multiple, numbers[i]);
  }
  return multiple;
}

class Moon {
  constructor(x, y, z) {
    this.start = {x, y, z};
    this.position = {x, y, z};
    this.velocity = {
      x: 0,
      y: 0,
      z: 0
    };
  }

  getPotentialEnergy() {
    return Math.abs(this.position.x) +
      Math.abs(this.position.y) +
      Math.abs(this.position.z);
  }

  getKineticEnergy() {
    return Math.abs(this.velocity.x) +
      Math.abs(this.velocity.y) +
      Math.abs(this.velocity.z);
  }

  getTotalEnergy() {
    return this.getPotentialEnergy() * this.getKineticEnergy();
  }

  applyGravity(moon) {
    if (moon.position.x < this.position.x) {
      this.velocity.x--;
      moon.velocity.x++;
    } else if (moon.position.x > this.position.x) {
      this.velocity.x++;
      moon.velocity.x--;
    }
    if (moon.position.y < this.position.y) {
      this.velocity.y--;
      moon.velocity.y++;
    } else if (moon.position.y > this.position.y) {
      this.velocity.y++;
      moon.velocity.y--;
    }
    if (moon.position.z < this.position.z) {
      this.velocity.z--;
      moon.velocity.z++;
    } else if (moon.position.z > this.position.z) {
      this.velocity.z++;
      moon.velocity.z--;
    }
  }

  applyVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  isAtStart(axis) {
    return this.position[axis] === this.start[axis] && this.velocity[axis] === 0;
  }
}

module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const steps = testNumber == 1 ? 10 : testNumber == 2 ? 100 : 1000;
  const moons = [];
  
  for (let vector of input) {
    moons.push(new Moon(vector[0], vector[1], vector[2]));
  }

  let step = 0;
  const axes = ['x', 'y', 'z'];
  const cycleLengths = {};
  while (true) {
    step++;
    for (let a = 0; a < moons.length; a++) {
      const moonA = moons[a];
      for (let b = a + 1; b < moons.length; b++) {
        const moonB = moons[b];
        moonA.applyGravity(moonB);
      }

      moonA.applyVelocity();
    }

    if (!isPart2) {
      if (step === steps) {
        break;
      }
    } else {
      axisLoop:
      for (let axis of axes) {
        if (!cycleLengths[axis]) {
          for (let moon of moons) {
            if (!moon.isAtStart(axis)) {
              continue axisLoop;
            }
          }
          cycleLengths[axis] = step;
        }
      }
      if (cycleLengths.x && cycleLengths.y && cycleLengths.z) {
        return lcm(cycleLengths.x, cycleLengths.y, cycleLengths.z);
      }
    }
  }

  result = moons.map(m => m.getTotalEnergy()).reduce((a, b) => a + b);

  return result;
}