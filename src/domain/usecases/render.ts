import { Cell, Game } from "entities/game";

type FramesResult = {
  nextFrame: string;
  betweenFrame?: string;
};

export const renderCells = (
  game: Game,
  renderCell: (cell: Cell, isLive: boolean) => string,
) => {
  const cells = game.mapCells(renderCell);
  return cells.map((row) => row.join(" ")).join("\n");
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
  const nextFrame = renderCells(game, (_, isLive) => (isLive ? "●" : " "));

  const betweenFrame = prevTurn
    ? renderCells(game, ({ x, y }, isLive) => {
        const died = !isLive && prevTurn.isLive(x, y);
        return isLive ? "●" : died ? "◌" : " ";
      })
    : undefined;

  return { nextFrame, betweenFrame };
}
