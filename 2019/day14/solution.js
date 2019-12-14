module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const requirements = {};
  const leftovers = {};

  for (let reaction of input) {
    const [_, outputQuantity, outputName] = reaction[1].match(/(\d+) (\S+)/);
    const spec = requirements[outputName] = requirements[outputName] || {};
    spec.quantity = +outputQuantity;
    spec.inputs = spec.inputs || {};
    for (let inputChemical of reaction[0].split(',')) {
      const [_, quantity, name] = inputChemical.match(/(\d+) (\S+)/);
      spec.inputs[name] = +quantity;
    }
  }

  const getRequiredOre = (chemical, quantity) => {
    if (leftovers[chemical]) {
      const reused = Math.min(quantity, leftovers[chemical]);
      quantity -= reused;
      leftovers[chemical] -= reused;
    }
    if (chemical === 'ORE') {
      return quantity;
    }
    const spec = requirements[chemical];
    const requiredReactions = Math.ceil(quantity / spec.quantity);
    let oreRequirement = 0;
    for (let inputChem in spec.inputs) {
      oreRequirement += getRequiredOre(inputChem, spec.inputs[inputChem] * requiredReactions);
    }
    const totalProduced = spec.quantity * requiredReactions;
    leftovers[chemical] = (leftovers[chemical] || 0) + totalProduced - quantity;
    return oreRequirement;
  };

  result = getRequiredOre('FUEL', 1);
  if (isPart2) {
    const availableOre = 1000000000000;
    let max = availableOre;
    let min = 0;
    let target =  min + Math.floor((max - min) / 2);
    while (true) {
      const ore = getRequiredOre('FUEL', target);
      if (ore === availableOre) {
        return target;
      }
      if (ore > availableOre) {
        max = target;
      } else if (ore < availableOre) {
        min = target;
      } else {
        return target;
      }
      if (max - min === 1) {
        return min;
      }
      target = min + Math.floor((max - min) / 2);
    }
  }

  return result;
}