import { Board } from "entities/board";
import { flat, isNonNullish, times } from "remeda";

export const asString = (game: Board): string => {
  return times(game.height, (y) =>
    times(game.width, (x) => {
      return game.isLive(x, y) ? "X" : "O";
    }).join(""),
  ).join("\n");
};

export const dedent = ([str]: TemplateStringsArray): string => {
  return str
    .split("\n")
    .map((line) => line.trimStart())
    .filter((s) => s.length)
    .join("\n");
};

export const fromString = ([game]: TemplateStringsArray): Board => {
  const rows = game
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length);
  const height = rows.length;
  const width = rows[0].length;

  const cells = rows.map((row, y) =>
    [...row].map((val, x) => (val === "X" ? { x, y } : null)),
  );
  const liveCells = flat(cells).filter(isNonNullish);

  return new Board(width, height, liveCells);
};
