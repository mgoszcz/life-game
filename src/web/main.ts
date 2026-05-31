// src/web/main.ts
import "./styles.css";

import { createRandomGrid } from "../core/state";
import { renderCanvas } from "./canvasRenderer";
import { webGameConfig } from "./config";
import { nextGeneration } from "../core/life";

const widthInput = document.querySelector<HTMLInputElement>("#widthInput")!;
const heightInput = document.querySelector<HTMLInputElement>("#heightInput")!;
const aliveInput = document.querySelector<HTMLInputElement>("#aliveInput")!;

const restartButton =
  document.querySelector<HTMLButtonElement>("#restartButton")!;
const resetButton = document.querySelector<HTMLButtonElement>("#resetButton")!;
const speedUpButton =
  document.querySelector<HTMLButtonElement>("#speedUpButton")!;
const speedDownButton =
  document.querySelector<HTMLButtonElement>("#speedDownButton")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pauseButton")!;

const speedValue = document.querySelector<HTMLSpanElement>("#speedValue")!;
const generationValue =
  document.querySelector<HTMLSpanElement>("#generationValue")!;

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;

ctx.canvas.width = webGameConfig.width * 10;
ctx.canvas.height = webGameConfig.height * 10;

createRandomGrid(webGameConfig);
renderCanvas(ctx);
gameLoop();

async function gameLoop() {
  let generation = 0;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    nextGeneration();
    generation++;
    generationValue.textContent = generation.toString();
    renderCanvas(ctx);
  }
}
