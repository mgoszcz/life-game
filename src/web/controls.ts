import { GAME_MODES } from "../core/modes";
import { state } from "../core/state";

export function decreaseSpeed() {
  if (state.speed < 1000) {
    state.speed += 20;
  }
}

export function increaseSpeed() {
  if (state.speed > 20) {
    state.speed -= 20;
  }
}

export function modeUp() {
  state.mode++;
  if (state.mode > GAME_MODES.length) {
    state.mode = 1;
  }
}

export function modeDown() {
  state.mode--;
  if (state.mode === 0) {
    state.mode = GAME_MODES.length;
  }
}
