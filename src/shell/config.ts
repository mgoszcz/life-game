import * as readline from "readline";

type GameConfig = {
  width: number;
  height: number;
  aliveChance: number; // np. 0.25 = 25%
};

export async function readConfig(): Promise<GameConfig> {
  const widthInput = await ask("Grid width [60]: ");
  const heightInput = await ask("Grid height [30]: ");
  const aliveInput = await ask("Alive cells % [25]: ");
  const width = Number(widthInput || 60);
  const height = Number(heightInput || 30);
  const alivePercent = Number(aliveInput || 25);

  return {
    width,
    height,
    aliveChance: alivePercent / 100,
  };
}

export const gameConfig: GameConfig = {
  width: 60,
  height: 30,
  aliveChance: 0.25,
};

export const initializeConfig = async () => {
  const userConfig = await readConfig();
  gameConfig.width = userConfig.width;
  gameConfig.height = userConfig.height;
  gameConfig.aliveChance = userConfig.aliveChance;
};

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
