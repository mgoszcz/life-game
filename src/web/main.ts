// src/web/main.ts
import "./styles.css";

import { createRandomGrid, state } from "../core/state";
import { renderCanvas } from "./canvasRenderer";
import { webGameConfig } from "./config";
import { nextGeneration } from "../core/life";
import { decreaseSpeed, increaseSpeed, modeDown, modeUp } from "./controls";
import { getModeNameById } from "../core/modes";

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
const pauseIndicator =
  document.querySelector<HTMLDivElement>("#pauseIndicator")!;
const liveCellsCounter =
  document.querySelector<HTMLSpanElement>("#aliveCountValue")!;
const modeUpButton = document.querySelector<HTMLButtonElement>("#modeUp")!;
const modeDownButton = document.querySelector<HTMLButtonElement>("#modeDown")!;
const modeDisplay = document.querySelector<HTMLDivElement>(".mode-selector")!;

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;

gameLoop();

// nadal UI jest odświeżane tylko przy obrocie pętli. Jeśli klikniesz speedUp, speedDown, modeUp albo modeDown w środku setTimeout, display może zmienić się dopiero po zakończeniu obecnego ticka.
// Najczystszy kierunek: zrobić małą funkcję typu renderHud() i wołać ją:
// w pętli po zmianie generacji/live cells,
// po reset,
// po restart,
// bezpośrednio w handlerach speedUp/speedDown,
// bezpośrednio w handlerach modeUp/modeDown,
// po pauzie, jeśli chcesz mieć wszystko zsynchronizowane.
// Czyli nie tylko pętla gry renderuje HUD, ale każdy event, który zmienia stan widoczny w HUD, od razu go odmalowuje. Wtedy UI przestaje zależeć od timingu symulacji.

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
    liveCellsCounter.textContent = state.liveCells.toString();
    generationValue.textContent = "0";
    await generationLoop();
  }
}

async function generationLoop() {
  let generation = 0;
  while (!state.newGameRequested && !state.resetRequested) {
    modeDisplay.textContent = getModeNameById(state.mode);
    speedValue.textContent = state.speed.toString();
    await new Promise((resolve) => setTimeout(resolve, state.speed));
    if (!state.isRunning) {
      continue;
    }
    nextGeneration();
    generation++;
    generationValue.textContent = generation.toString();
    liveCellsCounter.textContent = state.liveCells.toString();
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
  if (state.isRunning) {
    pauseIndicator?.classList.remove("on");
  } else {
    pauseIndicator?.classList.add("on");
  }
});

modeUpButton.addEventListener("click", () => {
  modeUp();
});

modeDownButton.addEventListener("click", () => {
  modeDown();
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
  const newAliveChanceInt = parseInt(aliveInput.value);
  const newAliveChance = newAliveChanceInt / 100;
  if (!isNaN(newAliveChance) && newAliveChance >= 0 && newAliveChance <= 1) {
    webGameConfig.aliveChance = newAliveChance;
  }
});
