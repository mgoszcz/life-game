import { webGameConfig as gameConfig } from "./config";
import { state } from "../core/state";

const OFFSET_X = 0;
const OFFSET_Y = 0;

export const renderCanvas = (context: CanvasRenderingContext2D) => {
  console.log(gameConfig.width, gameConfig.height);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  for (let y = 0; y < gameConfig.height; y++) {
    for (let x = 0; x < gameConfig.width; x++) {
      if (state.grid[y][x]) {
        context.fillStyle = "#39ff14";
        context.fillRect(x * 10, y * 10, 10, 10);
      } else {
        context.fillStyle = "#0a300a";
        context.fillRect(x * 10 + 10 / 3, y * 10 + 10 / 3, 3, 3);
      }
    }
  }

  //   let output = `CONWAY LIFE SIMULATOR\nGRID: ${gameConfig.width}x${gameConfig.height}\nGENERATION: ${state.generation}\nCYCLE TIME: ${state.speed} ms\n\n`;
  //   for (let y = 0; y < gameConfig.height; y++) {
  //     for (let x = 0; x < gameConfig.width; x++) {
  //       output += state.grid[y][x] ? "█" : ".";
  //     }
  //     output += "\n";
  //   }
  //   output +=
  //     "\n Press: 'q' - quit, 'space' - pause/resume, '+' - faster, '-' - slower, 'r' - reset, 'n' - new game\n";
  //   console.clear();
  //   process.stdout.write(output);
};
