// controls.ts

export type Controls = {
  quit: () => void;
  togglePause: () => void;
  faster: () => void;
  slower: () => void;
  reset: () => void;
  newGame: () => void;
};

export function setupControls(controls: Controls): void {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (key: string) => {
    // console.log("KEY:", JSON.stringify(key));
    switch (key) {
      case "q":
      case "\u0003": // CTRL+C
        cleanupInput();
        controls.quit();
        break;

      case " ":
        controls.togglePause();
        break;

      case "+":
      case "=": // na wielu klawiaturach '+' to Shift + '='
        controls.faster();
        break;

      case "-":
      case "_":
        controls.slower();
        break;

      case "r":
      case "R":
        controls.reset();
        break;

      case "n":
      case "N":
        controls.newGame();
        break;
    }
  });
}

function cleanupInput(): void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }

  process.stdin.pause();
}
