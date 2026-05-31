import { render } from "./renderer";
import { state } from "../core/state";
import { gameConfig, initializeConfig } from "./config";
import { nextGeneration } from "../core/life";
import { setupControls } from "./controls";

function enableGameInput() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
}

function disableGameInput() {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
}

function initializeControls() {
  setupControls({
    quit: () => {
      state.isRunning = false;
      process.exit(0);
    },

    togglePause: () => {
      state.isRunning = !state.isRunning;
    },

    faster: () => {
      state.speed = Math.max(20, state.speed - 20);
    },

    slower: () => {
      state.speed = Math.min(1000, state.speed + 20);
    },

    reset: () => {
      state.resetRequested = true;
    },

    newGame: () => {
      state.newGameRequested = true;
    },
  });
}

function initializeGrid() {
  state.grid = [];
  state.generation = 0;
  for (let y = 0; y < gameConfig.height; y++) {
    const line = [];
    for (let x = 0; x < gameConfig.width; x++) {
      if (Math.random() < gameConfig.aliveChance) {
        line.push(true);
      } else {
        line.push(false);
      }
    }
    state.grid.push(line);
  }
}

async function main() {
  initializeControls();
  while (1) {
    console.clear();
    disableGameInput();
    await initializeConfig();
    enableGameInput();
    console.log("Config:", gameConfig);
    while (1) {
      state.resetRequested = false;
      state.newGameRequested = false;
      initializeGrid();
      render();
      while (!state.resetRequested && !state.newGameRequested) {
        await new Promise((resolve) => setTimeout(resolve, state.speed));
        if (state.isRunning) {
          nextGeneration();
          state.generation++;
          render();
        }
      }

      if (state.newGameRequested) {
        break;
      }
    }
  }
}

main();
