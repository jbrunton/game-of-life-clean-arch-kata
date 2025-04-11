import { flat, isNonNullish } from "remeda";
import { Board } from "./board";
import { match } from "ts-pattern";

type CellContext = {
  isLive: boolean;
  neighborCount: number;
};

const isUnderpopulated = ({ isLive, neighborCount }: CellContext) =>
  isLive && neighborCount <= 1;
const isOverpopulated = ({ isLive, neighborCount }: CellContext) =>
  isLive && neighborCount >= 4;
const canReproducible = ({ isLive, neighborCount }: CellContext) =>
  !isLive && neighborCount === 3;

export const nextGeneration = (board: Board): Board => {
  const isAliveAfterTick = ({ isLive, neighborCount }: CellContext) =>
    match({ isLive, neighborCount })
      .when(isUnderpopulated, () => false)
      .when(isOverpopulated, () => false)
      .when(canReproducible, () => true)
      .otherwise(() => isLive);

  const liveCells = board.mapCells((isLive, cell) => {
    const neighborCount = board
      .getNeighbors(cell)
      .filter((c) => board.isLive(c)).length;

    return isAliveAfterTick({ isLive, neighborCount }) ? cell : null;
  });

  return new Board(
    board.width,
    board.height,
    flat(liveCells).filter(isNonNullish),
  );
};
