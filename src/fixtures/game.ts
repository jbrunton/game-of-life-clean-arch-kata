import { Game } from "entities/game";
import { flat, isNonNullish, times } from "remeda";

export const asString = (game: Game): string => {
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

export const fromString = ([game]: TemplateStringsArray): Game => {
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

  return new Game(width, height, liveCells);
};
