module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let layers = [];

  for (let line of input) {
    let parts = line.split(': ');
    let depth = +parts[0];
    let range = +parts[1];
    layers[depth] = {
      range: range,
      scanner: 0,
      direction: 1
    };
  }

  const moveScanners = () => {
    for (let layer of layers) {
      if (layer) {
        if (layer.range > 1) {
          layer.scanner += layer.direction;
          if (layer.scanner >= layer.range) {
            layer.scanner -= 2;
            layer.direction = -1;
          } else if (layer.scanner < 0) {
            layer.scanner = 1;
            layer.direction = 1;
          }
        }
      }
    }
  }

  const getSeverity = () => {
    let severity = 0;
    let position = -1;
    while (position < layers.length) {
      position++;
      if (layers[position] && layers[position].scanner === 0) {
        severity += position * layers[position].range;
      }
      moveScanners(); 
    }

    return severity;
  }

  const getLowestDelay = () => {
    let highestDelay = 0;
    let packets = [{
      position: -1,
      delay: highestDelay
    }];
    while (true) {
      for (let i = packets.length-1; i >= 0; i--) {
        let packet = packets[i];
        packet.position++;
        if (layers[packet.position] && layers[packet.position].scanner === 0) {
          packets.splice(i, 1);
        } else if (packet.position === layers.length - 1) {
          return packet.delay;
        }
      }
      moveScanners();

      packets.unshift({
        position: -1,
        delay: ++highestDelay
      });
    }
  }

  result = isPart2 ? getLowestDelay() : getSeverity();

  return result;
}