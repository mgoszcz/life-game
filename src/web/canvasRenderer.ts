import { webGameConfig as gameConfig } from "./config";
import { state } from "../core/state";

const OFFSET_X = 0;
const OFFSET_Y = 0;

export const renderCanvas = (context: CanvasRenderingContext2D) => {
  // console.log(gameConfig.width, gameConfig.height);
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

export const renderCanvasError = (
  context: CanvasRenderingContext2D,
  message: string,
) => {
  const { width, height } = context.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxTextWidth = Math.max(width - 80, 120);

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillStyle = "#ff2424";
  context.shadowColor = "#ff2424";
  context.shadowBlur = 12;
  context.font = "bold 24px monospace";
  context.fillText("SYSTEM ERROR", centerX, centerY - 36);

  context.fillStyle = "#f0d39a";
  context.shadowBlur = 5;
  context.font = "16px monospace";

  const words = message.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width <= maxTextWidth) {
      currentLine = nextLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    context.fillText(line, centerX, centerY + index * 22);
  });

  context.fillStyle = "#39ff14";
  context.shadowColor = "#39ff14";
  context.shadowBlur = 7;
  context.font = "14px monospace";
  context.fillText(
    "SELECT ANOTHER MODE AND PRESS RESTART",
    centerX,
    centerY + Math.max(lines.length, 1) * 22 + 26,
  );

  context.shadowBlur = 0;
};
