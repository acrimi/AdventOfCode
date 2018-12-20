let testNo = 1;
module.exports = (input, isPart2, isTest) => {
  let result = 0;

  input = input.replace(/\^|\$/g, '');
  const transforms = {
    N: {x: 0, y: 1},
    E: {x: 1, y: 0},
    S: {x: 0, y: -1},
    W: {x: -1, y: 0}
  };
  const rooms = {
    '0,0': 0
  };

  function getMinDistance(x, y) {
    return rooms[`${x},${y}`];
  }

  function setMinDistance(x, y, distance) {
    rooms[`${x},${y}`] = distance;
  }

  // Really wish I had tail recursion (T⌓T)
  let paths = [{x: 0, y: 0, offset: 0}];
  while (paths.length) {
    let nextPath = walkPath(paths.pop());
    if (nextPath) {
      if (nextPath.branches) {
        for (let branch of nextPath.branches) {
          branch.offset = nextPath.offset;
          paths.push(branch);
        }
      } else {
        paths.push(nextPath);
      }
    }
  }

  function walkPath(path, offset) {
    if (path.offset >= input.length) {
      return null;
    }
    let nextStep = input[path.offset];
    if (nextStep === '(') {
      let branch = {
        x: path.x,
        y: path.y,
        offset: path.offset,
        root: path
      };
      branch.root.branches = (branch.root.branches || []);
      branch.root.branches.push(branch);
      path = branch;
    } else if (nextStep === ')') {
      if (path.root) {
        path.root.offset = path.offset;
        path = path.root;
        if (path.root) {
          path.root.branches.splice(path.root.branches.indexOf(path), 1);
        }
        for (let branch of path.branches) {
          branch.root = path.root;
          if (branch.root) {
            branch.root.branches.push(branch);
          }
        }
      } else {
        console.log('closing branch without root!');
      }
    } else if (nextStep === '|') {
      if (path.root) {
        let branch = {
          x: path.root.x,
          y: path.root.y,
          offset: path.offset,
          root: path.root
        };
        branch.root.branches = (branch.root.branches || []);
        branch.root.branches.push(branch);
        path = branch;
      } else {
        console.log('branch without root!');
      }
    } else {
      let currentDistance = getMinDistance(path.x, path.y);
      let transform = transforms[nextStep];
      let nextX = path.x + transform.x;
      let nextY = path.y + transform.y;
      let distance = getMinDistance(nextX, nextY);
      if (distance) {
        setMinDistance(nextX, nextY, Math.min(distance, currentDistance + 1));
        setMinDistance(path.x, path.y, Math.min(distance + 1, currentDistance));
      } else {
        setMinDistance(nextX, nextY, currentDistance + 1);
      }
      path.x = nextX;
      path.y = nextY;
    }

    path.offset++;
    return path;
  }

  for (let distance of Object.values(rooms)) {
    result = Math.max(distance, result);
  }

  testNo++;
  return result;
}