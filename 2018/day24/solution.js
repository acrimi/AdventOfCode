module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const armies = {
    immune: {
      groups: [],
      totalUnits: 0
    },
    infection: {
      groups: [],
      totalUnits: 0
    }
  };
  const enemy = {
    immune: 'infection',
    infection: 'immune'
  };

  let type;
  let id = 0;
  for (let row of input) {
    if (row.length === 0) {
      continue;
    }

    let [_, label] = row.match(/(\w+)(?: System)?:/) || [];
    if (label) {
      type = label.toLowerCase();
      continue;
    }

    let [__, units] = row.match(/(\d+) units/);
    let [___, hp] = row.match(/(\d+) hit points/);
    let [____, weaknesses] = row.match(/weak to ([^;)]+)/) || [];
    let [_____, immunities] = row.match(/immune to ([^;)]+)/) || [];
    let [______, damage, attackType, initiative] = row.match(/(\d+) (\w+) damage at initiative (\d+)/);

    let group = {
      id: id++,
      type: type,
      units: +units,
      hp: +hp,
      weaknesses: weaknesses ? weaknesses.split(', ') : [],
      immunities: immunities ? immunities.split(', ') : [],
      attackDamage: +damage,
      attackType: attackType,
      initiative: +initiative
    };
    group.effectivePower = group.units * group.attackDamage;

    armies[type].groups.push(group);
    armies[type].totalUnits += group.units;
  }

  let attackSort = [...armies.immune.groups, ... armies.infection.groups].sort((a, b) => b.initiative - a.initiative);
  let targetSort = [...armies.immune.groups, ... armies.infection.groups];
  function sortTargeting() {
    targetSort.sort((a, b) => {
      let result = b.effectivePower - a.effectivePower;
      if (result === 0) {
        result = b.initiative - a.initiative;
      }
      return result;
    });
  }

  function getDamage(attacker, defender) {
    let damage = attacker.effectivePower;
    if (defender.weaknesses.includes(attacker.attackType)) {
      damage *= 2;
    } else if (defender.immunities.includes(attacker.attackType)) {
      damage = 0;
    }
    return damage;
  }

  while (armies.immune.totalUnits > 0 && armies.infection.totalUnits > 0) {
    // targeting
    let targets = new Set();
    sortTargeting();
    for (let group of targetSort) {
      group.target = null;
      let enemyGroups = [...armies[enemy[group.type]].groups].sort((a, b) => {
        let result = getDamage(group, b) - getDamage(group, a);
        if (result === 0) {
          result = b.effectivePower - a.effectivePower;
          if (result === 0) {
            result = b.initiative - a.initiative;
          }
        }
        return result;
      });

      for (let enemyGroup of enemyGroups) {
        if (!targets.has(enemyGroup.id)) {
          group.target = enemyGroup;
          targets.add(enemyGroup.id);
          break;
        }
      }
    }

    // attacking
    for (let group of attackSort) {
      if (group.units === 0) {
        continue;
      }
      if (group.target) {
        let damage = getDamage(group, group.target);
        let unitsLost = Math.min(group.target.units, Math.floor(damage / group.target.hp));
        group.target.units -= unitsLost;
        group.target.effectivePower = group.target.units * group.target.attackDamage;
        armies[group.target.type].totalUnits -= unitsLost;
        if (group.target.units === 0) {
          armies[group.target.type].groups.splice(armies[group.target.type].groups.indexOf(group.target), 1);
          targetSort.splice(targetSort.indexOf(group.target), 1);
        }
      }
    }
  }

  result = armies.immune.totalUnits + armies.infection.totalUnits;

  return result;
}