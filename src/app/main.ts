import { Game } from "entities/game";
import { playGame } from "./play";
import { getInitialBoard } from "./input";
import { parseNumber } from "./commands/parsers";
import { Command } from "commander";
import { getSavedGame, init, listGames, saveGame } from "data/save";
import { db } from "data/config";

const program = new Command("game-of-life");

program
  .command("save")
  .option("-w, --width <number>", "board width", parseNumber, 10)
  .option("-h, --height <number>", "board height", parseNumber, 10)
  .option("-s, --seed <number>", "seed value")
  .option("-c, --cell-count <number>", "number of live cells", parseNumber)
  .requiredOption("-n, --name <string>", "saved game name")
  .action(async (opts) => {
    await init();

    const width = opts.width;
    const height = opts.height;

    const game =
      opts.seed && opts.cellCount
        ? Game.seed({
            width,
            height,
            seed: opts.seed,
            cellCount: opts.cellCount,
          })
        : await getInitialBoard(width, height);
    await saveGame(opts.name, game);
    console.info(opts);
  });

program.command("list").action(async () => {
  const games = await listGames();
  games.forEach((game) => {
    console.info(game.name);
  });
});

program
  .command("play")
  .option("-w, --width <number>", "board width", parseNumber, 10)
  .option("-h, --height <number>", "board height", parseNumber, 10)
  .option("-s, --seed <number>", "seed value")
  .option("-c, --cell-count <number>", "number of live cells", parseNumber)
  .option("-t, --max-turns <number>", "max turns to play", parseNumber, 50)
  .option(
    "-d, --delay <number>",
    "delay per rendered frame, ms",
    parseNumber,
    50,
  )
  .option("-q, --quiet", "skips rendering the output")
  .option("-a, --print-all", "print all turns (disable animation)")
  .option("-l, --loop", "don't exit")
  .option("-n, --name <string>", "play a saved game")
  .action(async (opts) => {
    const width = opts.width;
    const height = opts.height;

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

    const quiet = opts.quiet ?? false;
    const loop = opts.loop ?? false;
    const printAll = opts.printAll ?? false;
    const maxTurns = opts.maxTurns;
    const delayMs = opts.delay;
    const name = opts.name;

    const game = opts.name
      ? await getSavedGame(name)
      : opts.seed && opts.cellCount
        ? Game.seed({
            width,
            height,
            seed: opts.seed,
            cellCount: opts.cellCount,
          })
        : await getInitialBoard(width, height);

    await playGame(game, { maxTurns, delayMs, quiet, loop, printAll });
  });

program
  .parseAsync()
  .then(() => db.destroy())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
