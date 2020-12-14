module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  if (isPart2 && testNumber > 1) {
    input = [0, input];
  }
  const earliest = +input[0];
  const allBuses = input[1].split(',');
  const buses = allBuses.filter(b => b != 'x').map(b => +b);

  if (!isPart2) {
    let closestDeparture;
    let id;
    for (const bus of buses) {
      const departure = Math.ceil(earliest / bus) * bus;
      if (closestDeparture == undefined || closestDeparture > departure) {
        closestDeparture = departure;
        id = bus;
      }
    }
    result = (closestDeparture - earliest) * id;
  } else {
    let bus = buses.shift();
    let step = bus;
    let time = bus;
    bus = buses.shift();
    let index = allBuses.indexOf(''+bus);
    while (bus != null) {
      if ((time + index) % bus == 0) {
        step *= bus;
        bus = buses.shift();
        index = allBuses.indexOf(''+bus);
      } else {
        time += step;
      }
    }
    result = time;
  }

  return result;
}