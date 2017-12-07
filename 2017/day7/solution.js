module.exports = (input, isPart2, isTest) => {
  let result = 0;

  let towers = {};
  let towerList = [];
  let supportedTowers = [];

  for (let line of input) {
    line.replace(/(\w+)\s\((\d+)\)(?:\s->\s((?:\w+(?:,\s)?)+))?/, (match, name, weight, supporting) => {
      towers[name] = {
        name: name,
        weight: +weight,
        supporting: supporting ? supporting.split(', ') : []
      };
      towerList.push(towers[name]);
      supportedTowers = supportedTowers.concat(towers[name].supporting);
    });
  }
  
  let base = towerList.find(t => supportedTowers.indexOf(t.name) === -1).name;

  if (!isPart2) {
    result = base;
  } else {
    let smallestWrongWeight = Number.MAX_VALUE;
    let targetTower = null;

    const calcTotalWeight = name => {
      let tower = towers[name];
      tower.totalWeight = tower.weight;
      for (let supported of tower.supporting) {
        tower.totalWeight += calcTotalWeight(supported);
      }

      return tower.totalWeight;
    };
    const checkBalance = name => {
      let tower = towers[name];
      if (tower.supporting.length) {
        let allWeights = tower.supporting.map(t => towers[t].totalWeight);
        let wrongWeight = allWeights.find((w, i) => {
          return allWeights.slice(0, i).indexOf(w) === -1 &&
            allWeights.slice(i+1).indexOf(w) === -1;
        });

        if (wrongWeight) {
          if (smallestWrongWeight > wrongWeight) {
            targetTower = tower;
            smallestWrongWeight = wrongWeight;
          }

          for (let supported of tower.supporting) {
            checkBalance(supported);
          }
        }
      }
    }

    calcTotalWeight(base);
    checkBalance(base);

    let allWeights = targetTower.supporting.map(t => towers[t].totalWeight);    
    let rightWeight = allWeights.find(w => w !== smallestWrongWeight);
    for (let supported of targetTower.supporting) {
      let t2 = towers[supported];
      if (t2.totalWeight === smallestWrongWeight) {
        result = t2.weight - (smallestWrongWeight - rightWeight);
        break;
      }
    }
  }

  return result;
}