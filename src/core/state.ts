import { GameConfig } from "./types";

export const state = {
  grid: [] as boolean[][],
  generation: 0,
  speed: 500,
  isRunning: true,
  resetRequested: false,
  newGameRequested: false,
  liveCells: 0,
  mode: 1,
};

export function createRandomGrid(config: GameConfig) {
  const grid: boolean[][] = [];
  state.liveCells = 0;

  for (let y = 0; y < config.height; y++) {
    const row: boolean[] = [];

    for (let x = 0; x < config.width; x++) {
      const cellState = Math.random() < config.aliveChance;
      row.push(cellState);
      if (cellState) {
        state.liveCells++;
      }
    }

    grid.push(row);
  }

  state.grid = grid;
}
