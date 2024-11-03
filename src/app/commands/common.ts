import { Argv } from "yargs";
import { StrictArgsType } from "./types";
import { getInitialBoard } from "app/input";
import { Game } from "entities/game";

export const seedGameBuilder = (yargs: Argv) =>
  yargs.options({
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
  });

export const buildSeedGame = async ({
  width,
  height,
  seed,
  cellCount,
}: StrictArgsType<typeof seedGameBuilder>) => {
  if (width * 2 > process.stdout.columns || height + 1 > process.stdout.rows) {
    console.error(
      `Console is too small (${process.stdout.columns / 2} x ${
        process.stdout.rows
      }) for specified dimensions (${width} x ${height}). Note: grid cells occupy two terminal columns.`,
    );
    process.exit(1);
  }

  if (seed && cellCount) {
    return Game.seed({
      width,
      height,
      seed: seed,
      cellCount: cellCount,
    });
  }

  return await getInitialBoard(width, height);
};
