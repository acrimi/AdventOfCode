var result = -1;

var mana = 500;
var hp = 50;

var boss = {
  hp: 55,
  damage: 8
};

var attacks = [
  {
    cost: 53,
    damage: 4
  },
  {
    cost: 73,
    damage: 2,
    heal: 2
  }
];

var effectSpells = [
  {
    cost: 113,
    effect: {
      duration: 6,
      armor: 7
    }
  },
  {
    cost: 173,
    effect: {
      duration: 6,
      damage: 3
    }
  },
  {
    cost: 229,
    effect: {
      duration: 5,
      mana: 101
    }
  }
];

var allSpells = [].concat(attacks).concat(effectSpells);

runGame({
  manaLeft: mana,
  manaSpent: 0,
  playerHp: hp,
  bossHp: boss.hp,
  armor: 0,
  effects: [],
  spells: []
});

function runGame(seed, nextSpell) {
  var game = JSON.parse(JSON.stringify(seed));

  if (game.manaSpent >= result && result >= 0) {
    return;
  }

  if (nextSpell) {
    // Begin Player turn action phase
    var spell = nextSpell;
    if (spell) {
      game.manaLeft -= spell.cost;
      game.manaSpent += spell.cost;
      if (game.manaLeft < 0) {
        return;
      }
      game.spells.push(spell);
      if (spell.effect) {
        castEffect(spell, game);
      } else {
        game.bossHp -= spell.damage;
        if (checkGame(game)) {
          return;
        }
        if (spell.heal) {
          game.playerHp += spell.heal;
        }
      }
    } else {
      game.playerHp = 0;
      return;
    }

    // Begin Boss turn effect phase
    applyEffects(game);

    if (game.bossHp <= 0) {
      return;
    }

    // Begin Boss turn action phase
    var damage = Math.max(1, boss.damage - game.armor);
    game.playerHp -= damage;
    if (game.playerHp <= 0) {
      return;
    }
  }

  // Begin Player turn effects phase
  /*
   * Uncomment for Part 2
   */
  // game.playerHp--;
  // if (game.playerHp <= 0) {
  //   return;
  // }

  applyEffects(game);

  if (game.bossHp <= 0) {
    return;
  }

  var spells = getSpells(game);
  for (var i = 0; i < spells.length; i++) {
    runGame(game, spells[i]);
  }
}

function applyEffects(game) {
  game.armor = 0;
  for (var k = game.effects.length-1; k >= 0; k--) {
    var e = game.effects[k];
    if (e.armor) {
      game.armor = e.armor;
    } else if (e.mana) {
      game.manaLeft += e.mana;
    } else if (e.damage) {
      game.bossHp -= e.damage;
      if (checkGame(game)) {
        return;
      }
    }

    e.timer--;
    if (e.timer <= 0) {
      game.effects.splice(k, 1);
    }
  }
}

function checkGame(game) {
  if (game.bossHp <= 0) {
    console.log('boss dead with mana '+game.manaSpent);
    if (result < 0 || game.manaSpent < result) {
      result = game.manaSpent;
    }
    return true;
  }
  return false;
}

function getSpells(game) {
  var spells = [];
  for (var i = 0; i < allSpells.length; i++) {
    var spell = allSpells[i];
    if (spell.cost <= game.manaLeft) {
      var activeEffect = false;
      if (spell.effect) {
        for (var j = 0; j < game.effects.length; j++) {
          var e = game.effects[j];
          if (e.mana == spell.effect.mana && e.damage == spell.effect.damage &&
            e.armor == spell.effect.armor) {
            activeEffect = true;
            break;
          }
        }
      }
      if (!activeEffect) {
        spells.push(spell);
      }
    }
  }
  return spells;
}

function castEffect(effect, game) {
  var eff = {
    timer: effect.effect.duration,
    mana: effect.effect.mana,
    damage: effect.effect.damage,
    armor: effect.effect.armor
  };
  for (var i = 0; i < game.effects.length; i++) {
    var e = game.effects[i];
    if (e.mana == eff.mana && e.damage == eff.damage && e.armor == eff.armor) {
      return;
    }
  }
  game.effects.push(eff);
}

console.log(result);