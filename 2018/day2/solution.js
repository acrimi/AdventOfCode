module.exports = (input, isPart2, isTest) => {
  let result = 0;

  if (!isPart2) {
    let numOfDoubles = 0;
    let numOfTriples = 0;

    for (let id of input) {
      let sorted = id.split('').sort().join('');
      
      let hasDouble = false;
      let hasTriple = false;

      let count = 0;
      let previous = null;
      for (let character of sorted) {
        if (previous == null) {
          previous = character;
        }
        if (character === previous) {
          count++;
        } else {
          if (count === 2) {
            hasDouble = true;
          } else if (count === 3) {
            hasTriple = true;
          }
          count = 1;
        }
        previous = character;
      }

      if (count === 2 || hasDouble) {
        numOfDoubles++;
      }
      if (count === 3 || hasTriple) {
        numOfTriples++;
      }
    }

    result = numOfDoubles * numOfTriples;
  } else {
    for (let id of input) {
      idLoop:
      for (let otherId of input) {
        if (id === otherId) {
          continue;
        }

        let difIndex = -1;
        let index = 0;
        for (let char of id) {
          if (otherId[index] !== char) {
            if (difIndex >= 0) {
              continue idLoop;
            }
            difIndex = index;
          }
          index++;
        }

        result = id.substring(0, difIndex) + id.substring(difIndex+1);
      }
    }
  }

  return result;
}