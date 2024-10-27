import { Game } from "entities/game";
import { times } from "remeda";

type FramesResult = {
  nextFrame: string;
  betweenFrame?: string;
};

export const renderFrames = (game: Game, prevTurn?: Game): FramesResult => {
  const nextFrame = times(game.height, (y) =>
    times(game.width, (x) => (game.isLive(x, y) ? "●" : " ")).join(" "),
  ).join("\n");

  const betweenFrame = prevTurn
    ? times(game.height, (y) =>
        times(game.width, (x) => {
          const isLive = game.isLive(x, y);
          const died = !isLive && prevTurn.isLive(x, y);
          return isLive ? "●" : died ? "◌" : " ";
        }).join(" "),
      ).join("\n")
    : undefined;

  return { nextFrame, betweenFrame };
};
