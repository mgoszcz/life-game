import * as readline from "readline";
import { render } from "./renderer";

const grid: boolean[][] = [];

export type GameConfig = {
  width: number;
  height: number;
  aliveChance: number; // np. 0.25 = 25%
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function readConfig(): Promise<GameConfig> {
  const widthInput = await ask("Grid width [60]: ");
  const heightInput = await ask("Grid height [30]: ");
  const aliveInput = await ask("Alive cells % [25]: ");
  rl.close();
  const width = Number(widthInput || 60);
  const height = Number(heightInput || 30);
  const alivePercent = Number(aliveInput || 25);

  return {
    width,
    height,
    aliveChance: alivePercent / 100,
  };
}

function initialize(config: GameConfig) {
  for (let y = 0; y < config.height; y++) {
    const line = [];
    for (let x = 0; x < config.width; x++) {
      if (Math.random() < config.aliveChance) {
        line.push(true);
      } else {
        line.push(false);
      }
    }
    grid.push(line);
  }
}

async function main() {
  console.clear();
  const config = await readConfig();
  console.log("Config:", config);
  initialize(config);
  render(grid, config);
  while (1) {}

  // tutaj dopiero:

  // const grid = createRandomGrid(config.width, config.height, config.aliveChance);

  // startGameLoop(grid);
}

main();
