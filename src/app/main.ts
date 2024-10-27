import { number } from "@inquirer/prompts";
import { Game } from "entities/game";
import { play } from "usecases/play";
import { renderFrames } from "usecases/render";
import { printFrame } from "./output";

const main = async () => {
  const width = await number({
    message: "Enter the board width",
    required: true,
    default: 10,
  });

  const height = await number({
    message: "Enter the board height",
    required: true,
    default: 10,
  });

  const seed = await number({ message: "seed", default: 0, required: true });

  const cellCount = await number({
    message: "How many cells do you want to seed the game with?",
    required: true,
    default: 20,
  });

  const game = Game.seed({
    width: width!,
    height: height!,
    seed: seed!,
    cellCount: cellCount!,
  });

  process.stdout.write("\u001Bc");

  const delayMs = 50;
  const screenHeight = height! + 1;

  await play(game, {
    maxTurns: 10,
    delayMs,
    onTurn: async (game, turn, prevTurn) => {
      const { nextFrame, betweenFrame } = renderFrames(game, prevTurn);

      if (betweenFrame) {
        printFrame(betweenFrame, {
          clearScreen: prevTurn !== undefined,
          screenHeight,
          header: `turn ${turn}`,
        });

        await delay(delayMs);
      }

      printFrame(nextFrame, {
        clearScreen: true,
        screenHeight,
        header: `turn ${turn}`,
      });

      await delay(delayMs);
    },
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

const delay = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));
