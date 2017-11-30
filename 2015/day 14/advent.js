var fs = require('fs');

var input = fs.readFileSync(__dirname + '/input', 'utf8');

var result = 0;

var descriptions = input.split('\n');

var time = 2503;

var reindeer = {};

for (var i = 0; i < descriptions.length; i++) {
  var desc = descriptions[i];
  var parts = desc.split(' ');
  var name = parts[0];
  var speed = parseInt(parts[3]);
  var flyTime = parseInt(parts[6]);
  var restTime = parseInt(parts[13]);
  reindeer[name] = {
    speed: speed,
    flyTime: flyTime,
    restTime: restTime
  };
}

var best = -1;

for (var key in reindeer) {
  var deer = reindeer[key];
  var dist = 0;
  var resting = false;
  var t = 0;

  while (t < time) {
    var step = 0;
    if (resting) {
      step = Math.min(deer.restTime, time - t);
      resting = false;
    } else {
      step = Math.min(deer.flyTime, time - t);
      dist += deer.speed * step;
      resting = true;
    }

    t += step;
  }

  if (best == -1 || dist > best) {
    best = dist;
  }

  console.log(dist);
}

result = best;

console.log(result);