module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const ingredientMap = {};
  const allergenMap = {};

  function checkIfIngredientFound(allergen) {
    if (allergenMap[allergen].length == 1) {
      const ingredient = allergenMap[allergen][0];
      ingredientMap[ingredient] = ingredientMap[ingredient] || {};
      ingredientMap[ingredient].allergen = allergen;
      for (const a2 in allergenMap) {
        if (a2 == allergen) {
          continue;
        }
        const index = allergenMap[a2].indexOf(ingredient);
        if (index >= 0) {
          allergenMap[a2].splice(index, 1);
          checkIfIngredientFound(a2);
        }
      }
    }
  }

  for (const line of input) {
    let [_, ingredients, allergens] = line.match(/(.*) \(contains (.*)\)/);
    ingredients = ingredients.split(' ');
    allergens = allergens.split(', ');
    for (const ingredient of ingredients) {
      const info = ingredientMap[ingredient] = ingredientMap[ingredient] || {};
      info.count = (info.count || 0) + 1;
      info.name = ingredient;
    }
    for (const allergen of allergens) {
      if (allergenMap[allergen] != null) {
        allergenMap[allergen] = allergenMap[allergen].filter(i => ingredients.includes(i));
      } else {
        allergenMap[allergen] = ingredients;
      }
      checkIfIngredientFound(allergen);
    }
  }

  if (!isPart2) {
    for (const ingredient in ingredientMap) {
      const info = ingredientMap[ingredient];
      if (!info.allergen) {
        result += info.count;
      }
    }
  } else {
    result = Object.values(ingredientMap)
      .filter(i => i.allergen != null)
      .sort((a, b) => a.allergen.localeCompare(b.allergen))
      .map(i => i.name)
      .join(',');
  }

  return result;
}