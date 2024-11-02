import { listGames } from "data/save";
import { pick } from "remeda";
import { CommandModule } from "yargs";

export const listCommand: CommandModule = {
  command: "list",
  describe: "list saved games",
  builder: {},
  handler: async () => {
    const games = await listGames();
    console.table(games.map((game) => pick(game, ["name", "description"])));
  },
};

// export default list;
