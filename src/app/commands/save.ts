import { getInitialBoard } from "app/input";
import { saveGame } from "data/save";
import { Game } from "entities/game";
import { Command, OptionsT } from "./types";

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
  name: {
    type: "string",
    alias: "n",
    describe: "saved game name",
    demandOption: true,
  },
} satisfies OptionsT;

export const saveCommand: Command<typeof args> = {
  command: "save",
  describe: "save a game to replay",
  builder: (yargs) => yargs.options(args),
  handler: async (args) => {
    const width = args.width;
    const height = args.height;

    const game =
      args.seed && args["cell-count"]
        ? Game.seed({
            width,
            height,
            seed: args.seed,
            cellCount: args["cell-count"],
          })
        : await getInitialBoard(width, height);

    await saveGame(args.name, game, args.description);
  },
};
