import { Argv } from "yargs";
import { StrictArgsType } from "./types";
import { selectInitialState } from "app/input";
import { seedBoard } from "usecases/seed";

export const initialStateBuilder = (yargs: Argv) =>
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
      alias: "c",
    },
  });

/**
 * Returns the initial state of a board. If a seed parameter is passed then the board will be
 * generated randomly using the given seed value. Otherwise, the user will be prompted to
 * interactively select the state of cells on the board.
 */
export const buildInitialState = async ({
  width,
  height,
  seed,
  cellCount,
}: StrictArgsType<typeof initialStateBuilder>) => {
  if (width * 2 > process.stdout.columns || height + 1 > process.stdout.rows) {
    console.error(
      `Console is too small (${process.stdout.columns / 2} x ${process.stdout.rows}) for specified dimensions (${width} x ${height}). Note: grid cells occupy two terminal columns.`,
    );
    process.exit(1);
  }

  if (seed && cellCount) {
    return seedBoard({
      width,
      height,
      seed: seed,
      cellCount: cellCount,
    });
  }

  return selectInitialState(width, height);
};
