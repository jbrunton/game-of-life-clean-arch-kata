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
    onFinish(game, stable, turn, cycle) {
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
      } else if (cycle) {
        console.info(
          `game entered cycle of length ${cycle.length} at turn ${turn - cycle.length * 2}`,
        );

        cycle.forEach((game, index) => {
          const { nextFrame, betweenFrame } = renderFrames(
            game,
            index > 0 ? cycle[index - 1] : undefined,
          );
          printFrame(betweenFrame ?? nextFrame, {
            clearScreen: false,
            screenHeight,
            header: `turn ${index + 1} of cycle`,
            delayMs: 0,
          });
        });

        const { betweenFrame } = renderFrames(
          cycle[0],
          cycle[cycle.length - 1],
        );
        printFrame(betweenFrame, {
          clearScreen: false,
          screenHeight,
          header: `cycle restarts`,
          delayMs: 0,
        });
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
