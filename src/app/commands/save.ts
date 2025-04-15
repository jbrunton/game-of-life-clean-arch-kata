import { saveGame } from "data/save";
import { Argv } from "yargs";
import { StrictCommandType } from "./types";
import { buildInitialState, initialStateBuilder } from "./common";

const builder = (yargs: Argv) =>
  initialStateBuilder(yargs).options({
    description: {
      type: "string",
      alias: "d",
      describe: "a description of the saved game",
    },
    name: {
      type: "string",
      alias: "n",
      describe: "saved game name",
      demandOption: true,
    },
  });

export const saveCommand: StrictCommandType<typeof builder> = {
  command: "save",
  describe: "save a game to replay",
  builder,
  handler: async (args) => {
    const game = await buildInitialState(args);

    await saveGame(args.name, game, args.description);
  },
};
