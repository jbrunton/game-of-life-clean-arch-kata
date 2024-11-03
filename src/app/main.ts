import { db } from "data/db";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { listCommand } from "./commands/list";
import { saveCommand } from "./commands/save";
import { playCommand } from "./commands/play";

const program = yargs(hideBin(process.argv))
  .command(listCommand)
  .command(saveCommand)
  .command(playCommand);

const run = async () => {
  await db.migrate.latest();
  await program.parseAsync();
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.destroy());
