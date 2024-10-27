import { Game } from "entities/game";
import { playGame } from "./play";
import { program } from "@commander-js/extra-typings";
import { getInitialBoard } from "./input";

program
  .name("game-of-life")
  .command("play")
  .option("-w, --width <number>", "board width", "10")
  .option("-h, --height <number>", "board height", "10")
  .option("-s, --seed <number>", "seed value", "0")
  .option("-c, --cell-count <number>", "number of live cells", "20")
  .option("-t, --max-turns <number>", "max turns to play", "50")
  .option("-d, --delay <number>", "delay per rendered frame, ms", "10")
  .option("-q, --quiet", "skips rendering the output")
  .option("-l, --loop", "don't exit")
  .action(async (opts) => {
    const width = parseInt(opts.width);
    const height = parseInt(opts.height);
    const seed = parseInt(opts.seed);
    const cellCount = parseInt(opts.cellCount);
    const maxTurns = parseInt(opts.maxTurns);
    const delayMs = parseInt(opts.delay);
    const quiet = opts.quiet ?? false;
    const loop = opts.loop ?? false;

    if (
      width * 2 > process.stdout.columns ||
      height + 1 > process.stdout.rows
    ) {
      console.error(
        `Console is too small (${process.stdout.columns / 2} x ${
          process.stdout.rows
        }) for specified dimensions (${width} x ${height}). Note: grid cells occupy two terminal columns.`,
      );
      process.exit(1);
    }

    const game = await getInitialBoard();

    // const game = Game.seed({
    //   width,
    //   height,
    //   seed,
    //   cellCount,
    // });

    await playGame(game, { maxTurns, delayMs, quiet, loop });
  });

program.parseAsync().catch((e) => {
  console.error(e);
  process.exit(1);
});
