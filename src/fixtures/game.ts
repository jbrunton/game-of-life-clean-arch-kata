import { Game } from "entities/game";
import { times } from "remeda";

export const asString = (game: Game): string => {
  return times(game.height, (y) =>
    times(game.width, (x) => {
      return game.isLive(x, y) ? "X" : "O";
    }).join(""),
  ).join("\n");
};

export const dedent = ([str]: TemplateStringsArray) => {
  return str
    .split("\n")
    .map((line) => line.trimStart())
    .filter((s) => s.length)
    .join("\n");
};
