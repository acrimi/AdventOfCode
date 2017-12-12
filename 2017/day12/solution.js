module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let targetId = 0;
  let programs = {};

  for (let line of input) {
    line.replace(/(\d+) <-> ((?:\d+(?:, )?)+)/, (match, id, otherIds) => {
      let ids = [].concat(otherIds.split(', ')).map(i => +i);
      ids.push(+id);
      for (let id of ids) {
        let group = programs[id] || [];
        group.push(...ids.filter(i => group.indexOf(i) === -1));
        programs[id] = group;
      }
    });
  }

  let countedIds = [];

  const countIds = (targetId) => {
    countedIds.push(targetId);
    let program = programs[targetId];
    for (let id of program) {
      if (countedIds.indexOf(id) === -1) {
        countIds(id);
      }
    }
  }
  
  if (!isPart2) {
    countIds(0);
    result = countedIds.length;
  } else {
    let allCountedIds = [];

    for (let id in programs) {
      if (allCountedIds.indexOf(+id) === -1) {
        result++;
        countIds(+id);
        allCountedIds.push(...countedIds);
        countedIds = [];
      }
    }
  }

  return result;
}