import { GameConfig } from "./types";

export const state = {
  grid: [] as boolean[][],
  generation: 0,
  speed: 500,
  isRunning: true,
  resetRequested: false,
  newGameRequested: false,
};

export function createRandomGrid(config: GameConfig) {
  const grid: boolean[][] = [];

  for (let y = 0; y < config.height; y++) {
    const row: boolean[] = [];

    for (let x = 0; x < config.width; x++) {
      row.push(Math.random() < config.aliveChance);
    }

    grid.push(row);
  }

  state.grid = grid;
}
