import { Board } from "entities/board";
import { play, PlayResult } from "usecases/play";
import { renderFrames } from "usecases/render";
import { printFrame } from "./output";

type GameOpts = {
  maxTurns: number;
  delayMs: number;
  quiet: boolean;
  loop: boolean;
  printAll: boolean;
};

export const playGame = async (game: Board, opts: GameOpts) => {
  const { quiet, loop, maxTurns } = opts;

  if (!quiet) {
    process.stdout.write("\u001Bc");
  }

  const result = await play(game, {
    maxTurns,
    loop,
    onTurn: onTurn(opts),
  });

  onFinish(opts)(result);
};

const onTurn =
  ({ quiet, delayMs, printAll }: GameOpts) =>
  async (game: Board, turn: number, prevTurn?: Board) => {
    if (quiet) {
      return;
    }

    const screenHeight = game.height + 1;

    const { nextFrame, betweenFrame } = renderFrames(game, prevTurn);

    if (betweenFrame && !printAll) {
      await printFrame(betweenFrame, {
        clearScreen: prevTurn !== undefined,
        screenHeight,
        header: `turn ${turn}`,
        delayMs,
      });
    }

    await printFrame(nextFrame, {
      clearScreen: !printAll,
      screenHeight,
      header: `turn ${turn}`,
      delayMs,
    });
  };

const onFinish =
  ({ quiet }: GameOpts) =>
  ({ game, settled, turn, cycle }: PlayResult) => {
    const screenHeight = game.height + 1;

    if (quiet) {
      // Print the last frame in quiet mode, because we didn't already print it.
      const { nextFrame } = renderFrames(game);

      printFrame(nextFrame, {
        clearScreen: false,
        screenHeight,
        header: `turn: ${turn}`,
        delayMs: 0,
      });
    }

    if (settled) {
      console.info(`game settled after ${turn} turns`);
    } else if (cycle) {
      console.info(
        `game entered cycle of length ${cycle.length} at turn ${turn - cycle.length * 2}`,
      );

      printCycle(cycle, screenHeight);
    } else {
      console.info(
        `game ended after max (${turn}) turns without settling or entering a cycle`,
      );
    }
  };

const printCycle = (cycle: Board[], screenHeight: number) => {
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

  const { betweenFrame } = renderFrames(cycle[0], cycle[cycle.length - 1]);
  printFrame(betweenFrame, {
    clearScreen: false,
    screenHeight,
    header: `cycle restarts`,
    delayMs: 0,
  });
};
