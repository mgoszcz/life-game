import { getModeById } from "./modes";
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

function createEmptyGrid(config: GameConfig): boolean[][] {
  const grid: boolean[][] = Array.from({ length: config.height }, () =>
    Array(config.width).fill(false),
  );
  return grid;
}

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

export function createModelGrid(config: GameConfig) {
  const grid: boolean[][] = createEmptyGrid(config);
  const mode = getModeById(state.mode);
  if (mode.model === null) throw new Error(`Mode ${mode.name} not supported`);

  const model = mode.model;

  state.liveCells = 0;

  const modelWidth = model[0].length;
  const modelHeight = model.length;

  if (modelWidth > config.width || modelHeight > config.height) {
    throw new Error("Model dimensions exceed grid dimensions.");
  }

  for (let y = 0; y < modelHeight; y++) {
    for (let x = 0; x < modelWidth; x++) {
      grid[y][x] = model[y][x];
      if (model[y][x]) {
        state.liveCells++;
      }
    }
  }
  state.grid = grid;
}
