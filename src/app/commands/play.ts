import { CommandModule } from "yargs";
import { GetArgsT, OptionsT } from "./types";
import { Game } from "entities/game";
import { getSavedGame } from "data/save";
import { getInitialBoard } from "app/input";
import { playGame } from "app/play";

const args = {
  width: {
    type: "number",
    alias: "w",
    default: 10,
    describe: "board width",
  },
  height: {
    type: "number",
    alias: "h",
    default: 10,
    describe: "board height",
  },
  seed: { type: "string", alias: "s" },
  "cell-count": {
    type: "number",
  },
  description: {
    type: "string",
    alias: "d",
    describe: "a description of the saved game",
  },
  quiet: {
    type: "boolean",
    alias: "q",
    describe: "skips rendering the output",
    default: false,
  },
  "print-all": {
    type: "boolean",
    alias: "a",
    describe: "print all turns (disable animation)",
    default: false,
  },
  loop: {
    type: "boolean",
    alias: "l",
    describe: "don't exit on cycles",
    default: false,
  },
  name: {
    type: "string",
    alias: "n",
    describe: "play a saved game",
  },
  "max-turns": {
    type: "number",
    alias: "t",
    describe: "max turns to play",
    default: 50,
  },
  delay: {
    type: "number",
    alias: "d",
    describe: "delay per rendered frame, ms",
    default: 50,
  },
} satisfies OptionsT;

type ArgsT = GetArgsT<typeof args>;

export const playCommand: CommandModule<object, ArgsT> = {
  command: "play",
  describe: "play a game",
  builder: (yargs) => yargs.options(args),
  handler: async (args: ArgsT) => {
    const width = args.width;
    const height = args.height;

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

    const quiet = args.quiet;
    const loop = args.loop;
    const printAll = args["print-all"];
    const maxTurns = args["max-turns"];
    const delayMs = args.delay;
    const name = args.name;

    const game = name
      ? await getSavedGame(name)
      : args.seed && args["cell-count"]
        ? Game.seed({
            width,
            height,
            seed: args.seed,
            cellCount: args["cell-count"],
          })
        : await getInitialBoard(width, height);

    await playGame(game, { maxTurns, delayMs, quiet, loop, printAll });
  },
};
