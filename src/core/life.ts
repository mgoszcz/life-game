import { state } from "./state";

export const nextGeneration = () => {
  const newGrid: boolean[][] = [];
  state.liveCells = 0;
  for (let y = 0; y < state.grid.length; y++) {
    const line = [];
    for (let x = 0; x < state.grid[y].length; x++) {
      const neighbours = countNeighbours(x, y);
      const nextState = determineNextState(state.grid[y][x], neighbours);
      if (nextState) {
        state.liveCells++;
      }
      line.push(nextState);
    }
    newGrid.push(line);
  }
  state.grid = newGrid;
};

const countNeighbours = (x: number, y: number) => {
  let neighboursCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const neighbourX = x + dx;
      const neighbourY = y + dy;
      if (
        neighbourX >= 0 &&
        neighbourX < state.grid[0].length &&
        neighbourY >= 0 &&
        neighbourY < state.grid.length
      ) {
        if (state.grid[neighbourY][neighbourX]) {
          neighboursCount++;
        }
      }
    }
  }
  return neighboursCount;
};

const determineNextState = (isAlive: boolean, neighbours: number): boolean => {
  if (isAlive) {
    if (neighbours === 2 || neighbours === 3) {
      return true;
    } else {
      return false;
    }
  } else {
    if (neighbours === 3) {
      return true;
    } else {
      return false;
    }
  }
};
