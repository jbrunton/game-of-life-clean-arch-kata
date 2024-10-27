import { Game } from "entities/game";

type FramesResult = {
  nextFrame: string;
  betweenFrame?: string;
};

export function renderFrames(game: Game): { nextFrame: string };
export function renderFrames(
  game: Game,
  prevTurn: Game,
): { nextFrame: string; betweenFrame: string };
export function renderFrames(
  game: Game,
  prevTurn?: Game,
): { nextFrame: string; betweenFrame?: string };
export function renderFrames(game: Game, prevTurn?: Game): FramesResult {
  const join = (cells: string[][]) =>
    cells.map((row) => row.join(" ")).join("\n");

  const nextFrame = join(game.mapCells((_, isLive) => (isLive ? "●" : " ")));

  const betweenFrame = prevTurn
    ? join(
        game.mapCells(({ x, y }, isLive) => {
          const died = !isLive && prevTurn.isLive(x, y);
          return isLive ? "●" : died ? "◌" : " ";
        }),
      )
    : undefined;

  return { nextFrame, betweenFrame };
}
