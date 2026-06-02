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
