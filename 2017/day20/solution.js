module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let particles = [];
  for (let line of input) {
    let [m, x, y, z] = line.match(/p=<(-?\d+),(-?\d+),(-?\d+)>/);
    let [vm, vx, vy, vz] = line.match(/v=<(-?\d+),(-?\d+),(-?\d+)>/);
    let [am, ax, ay, az] = line.match(/a=<(-?\d+),(-?\d+),(-?\d+)>/);
    particles.push({
      pos: {
        x: +x,
        y: +y,
        z: +z
      },
      vel: {
        x: +vx,
        y: +vy,
        z: +vz
      },
      accel: {
        x: +ax,
        y: +ay,
        z: +az
      }
    });
  }

  const update = () => {
    let destroyed = [];
    let positions = {};
    for (let particle of particles) {
      particle.vel.x += particle.accel.x;
      particle.vel.y += particle.accel.y;
      particle.vel.z += particle.accel.z;
      particle.pos.x += particle.vel.x;
      particle.pos.y += particle.vel.y;
      particle.pos.z += particle.vel.z;

      if (isPart2) {
        let pos = particle.pos.x + ',' + particle.pos.y + ',' + particle.pos.z;
        if (positions[pos]) {
          destroyed.push(positions[pos]);
          destroyed.push(particle);
        } else {
          positions[pos] = particle;
        }
      }
    }

    if (isPart2) {
      particles = particles.filter(p => {
        return destroyed.indexOf(p) === -1;
      });
    }
  };

  const stasisThreshold = 1000;
  let stasisCount = 0;
  let closestIndex = -1;
  let particleCount = particles.length;
  while (stasisCount < stasisThreshold) {
    update();

    if (!isPart2) {
      let previousClosest = closestIndex;
      let smallestDist = Number.MAX_VALUE;
      for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        let dist = Math.abs(particle.pos.x) +
                    Math.abs(particle.pos.y) +
                    Math.abs(particle.pos.z);
        if (dist < smallestDist) {
          smallestDist = dist;
          closestIndex = i;
        }
      }
      
      if (closestIndex === previousClosest) {
        stasisCount++;
      }
    } else {
      if (particles.length === particleCount) {
        stasisCount++;
      }

      particleCount = particles.length;
    }
  }

  result = !isPart2 ? closestIndex : particles.length;

  return result;
}