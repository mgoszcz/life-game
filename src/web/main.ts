// src/web/main.ts
import "./styles.css";

import { createModelGrid, createRandomGrid, state } from "../core/state";
import { renderCanvas } from "./canvasRenderer";
import { webGameConfig } from "./config";
import { nextGeneration } from "../core/life";
import { decreaseSpeed, increaseSpeed } from "./controls";
import { GAME_MODES, GAME_MODES_IDS, getModeById } from "../core/modes";

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
const autoSizeButton =
  document.querySelector<HTMLButtonElement>("#autoSizeButton")!;
const configChangedStatus =
  document.querySelector<HTMLDivElement>("#configChangedStatus")!;
const panelRegion =
  document.querySelector<HTMLDivElement>(".control-panel-region")!;
const panelToggle =
  document.querySelector<HTMLButtonElement>("#panelToggle")!;
const panelToggleLabel =
  panelToggle.querySelector<HTMLSpanElement>(".sr-only")!;

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;

const CELL_SIZE = 10;
const GRID_MIN_WIDTH = Number(widthInput.min);
const GRID_MAX_WIDTH = Number(widthInput.max);
const GRID_MIN_HEIGHT = Number(heightInput.min);
const GRID_MAX_HEIGHT = Number(heightInput.max);
const VIEWPORT_SAFETY_MARGIN = 6;

let isAutoSizeEnabled = false;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
let selectedMode = state.mode;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAutomaticGridSize() {
  const bodyStyles = getComputedStyle(document.body);
  const canvasStyles = getComputedStyle(canvas);
  const screenHeader =
    document.querySelector<HTMLDivElement>(".screen-header")!;
  const screenHeaderStyles = getComputedStyle(screenHeader);
  const panelToggleStyles = getComputedStyle(panelToggle);

  const horizontalSpace =
    canvas.clientWidth -
    parseFloat(canvasStyles.borderLeftWidth) -
    parseFloat(canvasStyles.borderRightWidth);

  const collapsedTopSpace =
    panelToggle.offsetHeight +
    parseFloat(panelToggleStyles.marginTop) +
    screenHeader.offsetHeight +
    parseFloat(screenHeaderStyles.marginTop) +
    parseFloat(screenHeaderStyles.marginBottom);

  const verticalSpace =
    window.innerHeight -
    parseFloat(bodyStyles.paddingTop) -
    parseFloat(bodyStyles.paddingBottom) -
    collapsedTopSpace -
    parseFloat(canvasStyles.borderTopWidth) -
    parseFloat(canvasStyles.borderBottomWidth) -
    VIEWPORT_SAFETY_MARGIN;

  return {
    width: clamp(
      Math.floor(horizontalSpace / CELL_SIZE),
      GRID_MIN_WIDTH,
      GRID_MAX_WIDTH,
    ),
    height: clamp(
      Math.floor(verticalSpace / CELL_SIZE),
      GRID_MIN_HEIGHT,
      GRID_MAX_HEIGHT,
    ),
  };
}

function updateAutomaticDimensionInputs() {
  const { width, height } = getAutomaticGridSize();
  widthInput.value = width.toString();
  heightInput.value = height.toString();
  updateConfigChangedStatus();
}

function hasConfigChanged() {
  const pendingWidth = Number.parseInt(widthInput.value, 10);
  const pendingHeight = Number.parseInt(heightInput.value, 10);
  const pendingAliveChance = Number.parseInt(aliveInput.value, 10) / 100;

  return (
    pendingWidth !== webGameConfig.width ||
    pendingHeight !== webGameConfig.height ||
    pendingAliveChance !== webGameConfig.aliveChance ||
    selectedMode !== state.mode
  );
}

function updateConfigChangedStatus() {
  configChangedStatus.classList.toggle("is-changed", hasConfigChanged());
}

function setAutoSizeEnabled(enabled: boolean) {
  isAutoSizeEnabled = enabled;
  autoSizeButton.setAttribute("aria-pressed", String(enabled));
  widthInput.disabled = enabled;
  heightInput.disabled = enabled;

  if (enabled) {
    updateAutomaticDimensionInputs();
  }
}

updateAutomaticDimensionInputs();
webGameConfig.width = Number(widthInput.value);
webGameConfig.height = Number(heightInput.value);
updateConfigChangedStatus();

widthInput.addEventListener("input", updateConfigChangedStatus);
heightInput.addEventListener("input", updateConfigChangedStatus);
aliveInput.addEventListener("input", updateConfigChangedStatus);

autoSizeButton.addEventListener("click", () => {
  setAutoSizeEnabled(!isAutoSizeEnabled);
});

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    if (isAutoSizeEnabled) {
      updateAutomaticDimensionInputs();
    }
  }, 100);
});

panelToggle.addEventListener("click", () => {
  const isCollapsed = panelRegion.classList.toggle("is-collapsed");
  const label = isCollapsed
    ? "Pokaż panel sterowania"
    : "Ukryj panel sterowania";

  panelToggle.setAttribute("aria-expanded", String(!isCollapsed));
  panelToggle.title = label;
  panelToggleLabel.textContent = label;
});

function generateGrid() {
  if (state.mode === GAME_MODES_IDS.RANDOM) {
    createRandomGrid(webGameConfig);
  } else if (state.mode == GAME_MODES_IDS.USER) {
    throw new Error("User Mode not supported");
  } else {
    createModelGrid(webGameConfig);
  }
}

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
// brak obsługi errorów

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
    generateGrid();
    renderCanvas(ctx);
    liveCellsCounter.textContent = state.liveCells.toString();
    generationValue.textContent = "0";
    await generationLoop();
  }
}

async function generationLoop() {
  let generation = 0;
  while (!state.newGameRequested && !state.resetRequested) {
    modeDisplay.textContent = getModeById(selectedMode).name;
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
  selectedMode++;
  if (selectedMode > GAME_MODES.length) {
    selectedMode = 1;
  }
  modeDisplay.textContent = getModeById(selectedMode).name;
  updateConfigChangedStatus();
});

modeDownButton.addEventListener("click", () => {
  selectedMode--;
  if (selectedMode === 0) {
    selectedMode = GAME_MODES.length;
  }
  modeDisplay.textContent = getModeById(selectedMode).name;
  updateConfigChangedStatus();
});

restartButton.addEventListener("click", () => {
  state.newGameRequested = true;
  state.generation = 0;
  state.mode = selectedMode;
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
  updateConfigChangedStatus();
});
