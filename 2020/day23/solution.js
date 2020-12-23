module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const moves = isPart2 ? 10000000 : 100;
  const sorted = [...input].sort((a, b) => a - b);
  const min = sorted.shift();
  let max = sorted.pop();
  const first = {
    value: input.shift()
  };
  const cups = {
    [first.value]: first
  };
  let cup = first;
  for (const c of input) {
    const next = {
      value: c
    };
    cups[c] = next;
    cup.next = next;
    cup = next;
  }
  if (isPart2) {
    for (let i = max + 1; i <= 1000000; i++) {
      const next = {
        value: i
      };
      cups[i] = next;
      cup.next = next;
      cup = next;
    }
    max = 1000000;
  }
  cup.next = first;

  cup = first;
  for (let i = 0; i < moves; i++) {
    let insertTarget = cup.value;
    const ineligible = [cup.value, cup.next.value, cup.next.next.value, cup.next.next.next.value];
    
    const removed = cup.next;
    const end = removed.next.next.next;
    cup.next = end;
    cup = end;

    while (ineligible.includes(insertTarget)) {
      insertTarget--;
      if (insertTarget < min) {
        insertTarget = max;
      }
    }

    let insert = cups[insertTarget];
    removed.next.next.next = insert.next;
    insert.next = removed;
  }

  const one = cups[1];
  if (!isPart2) {
    result = '';
    let c = one.next;
    while (c.value != 1) {
      result += c.value;
      c = c.next;
    }
  } else {
    result = one.next.value * one.next.next.value;
  }

  return result;
}