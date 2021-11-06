function seed(array) {
  return ([...array]);
}

function same([x, y], [j, k]) {
  if (x == j && y == k) return true;
  else return false

}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return !!this.find((c) => c[0] == cell[0] && c[1] == cell[1]);
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2'

};

const corners = (state = []) => {
  if (state.length === 0) return { topRight: [0, 0], bottomLeft: [0, 0] }
  let max = Math.max
  let min = Math.min
  let x = state.map(coord => coord[0])
  let y = state.map(coord => coord[1])
  return { topRight: [max(...x), max(...y)], bottomLeft: [min(...x), min(...y)] }
};

const printCells = (state) => {
  let rect = corners(state)
  let max = rect.topRight, min = rect.bottomLeft;
  let cellsStr = "";

  for (let i = max[1]; i >= min[1]; i--) {
    for (let j = min[0]; j <= max[0]; j++) {
      cellsStr = cellsStr + printCell([j, i], state)
      if (j === max[0]) {
        cellsStr = cellsStr + '\n'
      } else {
        cellsStr = cellsStr + ' '
      }
    }
  }
  return cellsStr
};


const getNeighborsOf = (cell) => {
  let neighbors = []
  let x = cell[0]
  let y = cell[1]
  let maxX = x + 1
  let maxY = y + 1
  let minX = x - 1
  let minY = y - 1
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      if (!same([i, j], cell)) {
        neighbors.push([i, j])
      }
    }
  }
  return neighbors
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell)
  return neighbors.filter(c => contains.call(state, c))
};



const willBeAlive = (cell, state) => {
  let neighbors = getLivingNeighbors(cell, state)
  let aliveNeighbors = neighbors.length
  if (aliveNeighbors === 3) return true
  if (aliveNeighbors === 2 && contains.call(state, cell)) return true
  return false
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  let states = [state]
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));
  }
  return states;
};



const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;