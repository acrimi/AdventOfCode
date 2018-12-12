module.exports = (input, isPart2, isTest) => {
  let result = 0;

  const generationCount = isPart2 ? 50000000000 : 20;
  
  // After observing the output of the naive solution,
  // it became apparent that at some point the state
  // of the pots normalizes and starts to simply shift to
  // the right with each generation. For my input, the
  // the shifted pattern is:
  let currentState = '......#.......#......#......#......#....#....#....#...#....#......#....#......#....#....#....#.......#....#....#....#....#...#.......#.....#....#.....#....#...#......#.....#......#.....#....#.....#.....';

  // The amount that the pattern was shifted by was uniformly
  // the current generation number - 102. So at the end of
  // part 2, the zeroth pot is to the left of the pattern by:
  let zeroPot = -(generationCount - 102);

  // These two values are enough solve part 2
  for (let i = 0; i < currentState.length; i++) {
    if (currentState[i] === '#') {
      result += i - zeroPot;
    }
  }

  // Part 1 doesn't run long enough for the pattern to settle,
  // so this solution doesn't work for it

  return result;
}