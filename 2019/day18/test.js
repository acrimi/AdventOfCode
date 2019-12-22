const routes = {
  ['@']: {
    a: 2,
    b: {
      4: 'a'
    },
    c: {
      6: 'b'
    },
    d: {
      30: 'b'
    },
    e: {
      8: 'ac'
    },
    f: {
      14: 'acde'
    }
  },
  a: {
    ['@']: 2,
    b: 6,
    c: {
      4: 'b'
    },
    d: {
      28: 'b'
    },
    e: {
      10: 'c'
    },
    f: {
      16: 'ced'
    }
  },
  b: {
    ['@']: {
      4: 'a'
    },
    a: {
      6: 'a'
    },
    c: {
      10: 'a'
    },
    d: {
      34: 'a'
    },
    e: {
      4: 'c'
    },
    f: {
      10: 'ced'
    }
  },
  c: {
    ['@']: {
      6: 'b'
    },
    a: {
      4: 'b'
    },
    b: {
      10: 'ab'
    },
    d: 24,
    e: {
      14: 'ab'
    },
    f: {
      20: 'abed'
    }
  },
  d: {
    ['@']: {
      30: 'b'
    },
    a: {
      28: 'b'
    },
    b: {
      34: 'ab'
    },
    c: 24,
    e: {
      38: 'abc'
    },
    f: {
      44: 'abce'
    }
  },
  e: {
    ['@']: {
      8: 'ac'
    },
    a: {
      10: 'ac'
    },
    b: {
      4: 'c'
    },
    c: {
      14: 'abc'
    },
    d: {
      38: 'abc'
    },
    f: {
      6: 'd'
    }
  },
  f: {
    ['@']: {
      14: 'acde'
    },
    a: {
      16: 'acde'
    },
    b: {
      10: 'cde'
    },
    c: {
      20: 'abcde'
    },
    d: {
      44: 'abcde'
    },
    e: {
      6: 'de'
    }
  }
};
const keys = ['a', 'b', 'c', 'd', 'e', 'f'];

const queue = [{
  steps: 0,
  keys: '@'
}];

const insertRoute = (route) => {
  let i = 0;
  for (; i < queue.length; i++) {
    const other = queue[i];
    let result = route.steps - other.steps;
    if (result === 0) {
      result = other.keys.length - route.keys.length;
    }
    if (result < 0) {
      break;
    }
  }
  queue.splice(i, 0, route);
};

const extendRoute = (route) => {
  const startingKey = route.keys[route.keys.length - 1];
  const possibleRoutes = routes[startingKey];
  keyLoop:
  for (let key of keys) {
    if (route.keys.indexOf(key) >= 0) {
      continue;
    }

    if (typeof possibleRoutes[key] === 'number') {
      insertRoute({
        steps: route.steps + possibleRoutes[key],
        keys: route.keys + key
      });
    } else {
      const pathObj = possibleRoutes[key];
      const distance = +Object.keys(pathObj)[0];
      const locks = pathObj[distance];
      for (let i = 0; i < locks.length; i++) {
        if (route.keys.indexOf(locks[i]) === -1) {
          // missing lock
          continue keyLoop;
        }
      }

      insertRoute({
        steps: route.steps + distance,
        keys: route.keys + key
      });
    }
  }
};

while (queue.length) {
  const route = queue.shift();
  if (route.keys.length === keys.length + 1) {
    console.log(route);
    break;
  }
  extendRoute(route);
}
