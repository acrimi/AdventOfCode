module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const evaluateNode = (data, offset) => {
    let childCount = data[offset++];
    let metaCount = data[offset++];
    let node = {
      children: [],
      metaData: [],
      length: 2 + metaCount,
      value: 0
    };

    for (let i = 0; i < childCount; i++) {
      let child = evaluateNode(data, offset);
      offset += child.length;
      node.children.push(child);
      node.length += child.length;
    }

    for (let i = 0; i < metaCount; i++) {
      let metaData = data[offset++];
      result += metaData;
      node.metaData.push(metaData);
      if (childCount === 0) {
        node.value += metaData;
      } else if (metaData > 0 && metaData <= childCount) {
        node.value += node.children[metaData - 1].value;
      }
    }

    return node;
  };

  let root = evaluateNode(input, 0);
  if (isPart2) {
    result = root.value;
  }

  return result;
}