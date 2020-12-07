module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const target = 'shiny gold';
  const rules = {};

  for (let rule of input) {
    const [_, color] = rule.match(/(.*?) bags contain/) || [];
    const children = {};
    rules[color] = children;

    rule.replace(/(\d+) (.+?) bag/g, (_, quantity, color) => {
      children[color] = +quantity;
    });
  }

  function hasTarget(color) {
    if (rules[color].hasTarget) {
      return true;
    }
    for (const child in rules[color]) {
      if (child === target || hasTarget(child)) {
        rules[color].hasTarget = true;
        return true;
      }
    }
  }

  function countBags(color) {
    if (rules[color].totalCount == null) {
      let count = 0;
      for (const child in rules[color]) {
        count += rules[color][child] + rules[color][child] * countBags(child);
      }
      rules[color].totalCount = count;
    }
    return rules[color].totalCount;
  }

  if (!isPart2) {
    for (const color in rules) {
      if (hasTarget(color)) {
        result++;
      }
    }
  } else {
    result = countBags(target);
  }

  return result;
}