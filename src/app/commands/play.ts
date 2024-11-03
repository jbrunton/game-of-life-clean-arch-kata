import { getSavedGame } from "data/save";
import { playGame } from "app/play";
import { Argv } from "yargs";
import { StrictCommandType } from "./types";
import { buildSeedGame, seedGameBuilder } from "./common";
import { pick } from "remeda";

const builder = (yargs: Argv) =>
  seedGameBuilder(yargs).options({
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
  });

export const playCommand: StrictCommandType<typeof builder> = {
  command: "play",
  describe: "play a game",
  builder,
  handler: async (args) => {
    const game = args.name
      ? await getSavedGame(args.name)
      : await buildSeedGame(args);

    await playGame(game, {
      delayMs: args.delay,
      ...pick(args, ["quiet", "loop", "maxTurns", "printAll"]),
    });
  },
};
