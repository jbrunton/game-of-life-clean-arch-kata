import { Cell, Board } from "entities/board";

type FramesResult = {
  nextFrame: string;
  betweenFrame?: string;
};

export const renderCells = (
  game: Board,
  renderCell: (isLive: boolean, cell: Cell) => string,
) => {
  const cells = game.mapCells(renderCell);
  return cells.map((row) => row.join(" ")).join("\n");
};

export function renderFrames(game: Board): { nextFrame: string };

export function renderFrames(
  game: Board,
  prevTurn: Board,
): { nextFrame: string; betweenFrame: string };

export function renderFrames(
  game: Board,
  prevTurn?: Board,
): { nextFrame: string; betweenFrame?: string };

export function renderFrames(game: Board, prevTurn?: Board): FramesResult {
  const nextFrame = renderCells(game, (isLive) => (isLive ? "●" : " "));

  const betweenFrame = prevTurn
    ? renderCells(game, (isLive, cell) => {
        const died = !isLive && prevTurn.isLive(cell);
        return isLive ? "●" : died ? "◌" : " ";
      })
    : undefined;

  return { nextFrame, betweenFrame };
}
