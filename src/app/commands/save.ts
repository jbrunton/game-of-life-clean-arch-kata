import { saveGame } from "data/save";
import { Argv } from "yargs";
import { StrictCommandType } from "./types";
import { buildSeedGame, seedGameBuilder } from "./common";

const builder = (yargs: Argv) =>
  seedGameBuilder(yargs).options({
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
    const game = await buildSeedGame(args);

    await saveGame(args.name, game, args.description);
  },
};
