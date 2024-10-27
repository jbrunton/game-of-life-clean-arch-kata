import { Game } from "entities/game";
import { play } from "usecases/play";
import { renderFrames } from "usecases/render";
import { printFrame } from "./output";

type GameOpts = {
  maxTurns: number;
  delayMs: number;
  quiet: boolean;
};

export const playGame = async (
  game: Game,
  { maxTurns, delayMs, quiet }: GameOpts,
) => {
  if (!quiet) {
    process.stdout.write("\u001Bc");
  }

  const screenHeight = game.height + 1;

  await play(game, {
    maxTurns,
    onFinish(game, stable, turn) {
      if (quiet) {
        const { nextFrame } = renderFrames(game);

        printFrame(nextFrame, {
          clearScreen: false,
          screenHeight,
          header: `turn: ${turn}`,
          delayMs: 0,
        });
      }

      if (stable) {
        console.info(`game is stable after ${turn} turns`);
      } else {
        console.info(`game completed after max (${turn}) turns`);
      }
    },
    onTurn: async (game, turn, prevTurn) => {
      if (quiet) {
        return;
      }

      const { nextFrame, betweenFrame } = renderFrames(game, prevTurn);

      if (betweenFrame) {
        await printFrame(betweenFrame, {
          clearScreen: prevTurn !== undefined,
          screenHeight,
          header: `turn ${turn}`,
          delayMs,
        });
      }

      await printFrame(nextFrame, {
        clearScreen: true,
        screenHeight,
        header: `turn ${turn}`,
        delayMs,
      });
    },
  });
};
