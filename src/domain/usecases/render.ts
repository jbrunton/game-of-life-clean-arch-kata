import { Game } from "entities/game";
import { times } from "remeda";

export const renderTurn = (game: Game): string => {
  return times(game.height, (y) =>
    times(game.width, (x) => (game.isLive(x, y) ? "●" : " ")).join(" "),
  ).join("\n");
};
