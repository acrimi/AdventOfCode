module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let maxLength = 0;
  let components = [];
  let portMapping = {};

  for (let line of input) {
    let [m, port1, port2] = line.match(/(\d+)\/(\d+)/) || [];
    let component = {
      port1: +port1,
      port2: +port2
    };

    components.push(component);
    portMapping[port1] = portMapping[port1] || [];
    portMapping[port1].push(component);
    portMapping[port2] = portMapping[port2] || [];
    portMapping[port2].push(component);
  }

  const getScore = (list) => {
    return list.reduce((sum, c) => {
      return sum + c.port1 + c.port2;
    }, 0);
  };

  let used = [];
  const getNextComponent = (port, list) => {
    let available = portMapping[port].filter(c => !list.includes(c));
    if (available.length === 0) {
      let score = getScore(list);
      maxLength = Math.max(maxLength, list.length);
      if (!isPart2 || maxLength === list.length) {
        result = Math.max(score, result);
      }
    }
    available.sort((c1, c2) => {
      return (c2.port1 + c2.port2) - (c1.port2 + c1.port2);
    });
    for (let component of available) {
      let newList = [component].concat(list);
      let newPort = component.port1 === port ? component.port2 : component.port1;
      getNextComponent(newPort, newList);
    }
  }

  getNextComponent(0, []);

  return result;
}