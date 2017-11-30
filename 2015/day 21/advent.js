var result = 0;

var boss = {
  hp: 103,
  damage: 9,
  armor: 2
};

var me = {
  hp: 100
};

var weapons = [ 
  {cost: 8, damage: 4},
  {cost: 10, damage: 5},
  {cost: 25, damage: 6},
  {cost: 40, damage: 7},
  {cost: 74, damage: 8}
];
var armors = [
  {cost: 13, armor: 1},
  {cost: 31, armor: 2},
  {cost: 53, armor: 3},
  {cost: 75, armor: 4},
  {cost: 102, armor: 5}
];
var rings = [
  { cost: 25, damage: 1},
  { cost: 50, damage: 2},
  { cost: 100, damage: 3},
  { cost: 20, armor: 1},
  { cost: 40, armor: 2},
  { cost: 80, armor: 3}
];

var best = -1;

for (var i = 0; i < weapons.length; i++) {
  var cost = 0;
  var weapon = weapons[i];
  cost += weapon.cost;

  if (canWin(weapon)) {
    checkCost(cost);
  }
  checkWithRings(weapon);
  for (var j = 0; j < armors.length; j++) {
    var armor = armors[j];
    if (canWin(weapon, armor)) {
      checkCost(cost + armor.cost);
    }
    checkWithRings(weapon, armor);
  }

}

result = best;

function checkWithRings(weapon, armor) {
  for (var i = 0; i < rings.length; i++) {
    var cost = weapon.cost + (armor ? armor.cost: 0);
    var ring = rings[i];
    cost += ring.cost;
    if (canWin(weapon, armor, ring)) {
      checkCost(cost);
    }
    for (var j = i+1; j < rings.length; j++) {
      var ring2 = rings[j];
      if (canWin(weapon, armor, ring, ring2)) {
        checkCost(cost + ring2.cost);
      }
    }
  }
}

function checkCost(cost) {
  if (best == -1 || cost < best) {
  // if (best == -1 || cost > best) {  // Uncomment for Part 2
    best = cost;
  }
}

function canWin(weapon, armor, ring1, ring2) {
  var damage = (weapon ? weapon.damage : 0);
  if (ring1 != null && ring1.damage) {
    damage += ring1.damage;
  }
  if (ring2 != null && ring2.damage) {
    damage += ring2.damage;
  }

  var armor = armor ? armor.armor : 0;
  if (ring1 != null && ring1.armor) {
    armor += ring1.armor;
  }
  if (ring2 != null && ring2.armor) {
    armor += ring2.armor;
  }

  var enemyTurns = Math.ceil(me.hp / Math.max(1, boss.damage - armor));
  var myTurns = Math.ceil(boss.hp / Math.max(1, damage - boss.armor));

  return myTurns <= enemyTurns;
  // return enemyTurns < myTurns;  // Uncomment for Part 2
}


console.log(result);