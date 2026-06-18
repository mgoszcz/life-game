// src/web/main.ts
import "./styles.css";

import { createRandomGrid, state } from "../core/state";
import { renderCanvas } from "./canvasRenderer";
import { webGameConfig } from "./config";
import { nextGeneration } from "../core/life";
import { decreaseSpeed, increaseSpeed } from "./controls";

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

gameLoop();

async function gameLoop() {
  while (1) {
    state.newGameRequested = false;
    ctx.canvas.width = webGameConfig.width * 10;
    ctx.canvas.height = webGameConfig.height * 10;
    await resetLoop();
  }
}

async function resetLoop() {
  while (!state.newGameRequested) {
    state.resetRequested = false;
    createRandomGrid(webGameConfig);
    renderCanvas(ctx);
    await generationLoop();
  }
}

async function generationLoop() {
  let generation = 0;
  while (!state.newGameRequested && !state.resetRequested) {
    await new Promise((resolve) => setTimeout(resolve, state.speed));
    if (!state.isRunning) {
      continue;
    }
    nextGeneration();
    generation++;
    generationValue.textContent = generation.toString();
    speedValue.textContent = state.speed.toString();
    renderCanvas(ctx);
  }
}

resetButton.addEventListener("click", () => {
  state.generation = 0;
  state.resetRequested = true;
});

speedUpButton.addEventListener("click", () => {
  increaseSpeed();
});

speedDownButton.addEventListener("click", () => {
  decreaseSpeed();
});

pauseButton.addEventListener("click", () => {
  state.isRunning = !state.isRunning;
});

restartButton.addEventListener("click", () => {
  state.newGameRequested = true;
  state.generation = 0;
  const newWidth = parseInt(widthInput.value, 10);
  if (!isNaN(newWidth) && newWidth > 0) {
    webGameConfig.width = newWidth;
  }
  const newHeight = parseInt(heightInput.value, 10);
  if (!isNaN(newHeight) && newHeight > 0) {
    webGameConfig.height = newHeight;
  }
  const newAliveChance = parseFloat(aliveInput.value);
  if (!isNaN(newAliveChance) && newAliveChance >= 0 && newAliveChance <= 1) {
    webGameConfig.aliveChance = newAliveChance;
  }
});
