// Random

// Oscillator

// Glider

// Spaceship

// Gun

export const GAME_MODES = [
  { id: 1, name: "RANDOM" },
  { id: 2, name: "OSCILLATOR" },
  { id: 3, name: "GLIDER" },
  { id: 4, name: "SPACESHIP" },
  { id: 5, name: "GUN" },
  { id: 6, name: "USER" },
];

export function getModeNameById(id: number): string {
  const searchedMode = GAME_MODES.filter((mode) => mode.id === id);
  if (searchedMode.length != 1) {
    console.error(`Mode ${id} not found`);
    return "ERROR";
  }
  return searchedMode[0].name;
}
