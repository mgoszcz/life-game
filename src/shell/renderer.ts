import { gameConfig } from "./config";
import { state } from "../core/state";

export const render = () => {
  let output = `CONWAY LIFE SIMULATOR\nGRID: ${gameConfig.width}x${gameConfig.height}\nGENERATION: ${state.generation}\nCYCLE TIME: ${state.speed} ms\n\n`;
  for (let y = 0; y < gameConfig.height; y++) {
    for (let x = 0; x < gameConfig.width; x++) {
      output += state.grid[y][x] ? "█" : ".";
    }
    output += "\n";
  }
  output +=
    "\n Press: 'q' - quit, 'space' - pause/resume, '+' - faster, '-' - slower, 'r' - reset, 'n' - new game\n";
  console.clear();
  process.stdout.write(output);
};
