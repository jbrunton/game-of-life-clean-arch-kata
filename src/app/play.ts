import { Game } from "entities/game";
import { play } from "usecases/play";
import { renderFrames } from "usecases/render";
import { printFrame } from "./output";

export const playGame = async (game: Game) => {
  process.stdout.write("\u001Bc");

  const delayMs = 50;
  const screenHeight = game.height + 1;

  await play(game, {
    maxTurns: 10,
    onFinish(stable, turn) {
      if (stable) {
        console.info(`game is stable after ${turn} turns`);
      } else {
        console.info(`game completed after max (${turn}) turns`);
      }
    },
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

const delay = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));
