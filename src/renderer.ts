import { GameConfig } from "./main";

export const render = (grid: boolean[][], config: GameConfig) => {
  let output = "";
  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
      output += grid[y][x] ? "█" : ".";
    }
    output += "\n";
  }
  console.clear();
  process.stdout.write(output);
};
