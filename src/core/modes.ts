// Random

import { glider } from "../models/glider";
import { gun } from "../models/gun";
import { spaceship } from "../models/spaceship";

type GameMode = {
  id: number;
  name: string;
  model: boolean[][] | null;
};

export const GAME_MODES_IDS = {
  RANDOM: 1,
  OSCILLATOR: 2,
  GLIDER: 3,
  SPACESHIP: 4,
  GUN: 5,
  USER: 6,
};

export const GAME_MODES: GameMode[] = [
  { id: GAME_MODES_IDS.RANDOM, name: "RANDOM", model: null },
  { id: GAME_MODES_IDS.OSCILLATOR, name: "OSCILLATOR", model: null },
  { id: GAME_MODES_IDS.GLIDER, name: "GLIDER", model: glider },
  { id: GAME_MODES_IDS.SPACESHIP, name: "SPACESHIP", model: spaceship },
  { id: GAME_MODES_IDS.GUN, name: "GUN", model: gun },
  { id: GAME_MODES_IDS.USER, name: "USER", model: null },
];

export function getModeById(id: number): GameMode {
  const searchedMode = GAME_MODES.filter((mode) => mode.id === id);
  if (searchedMode.length != 1) {
    console.error(`Mode ${id} not found`);
    return { id: 0, name: "ERROR", model: null };
  }
  return searchedMode[0];
}
