import { flat, isNonNullish } from "remeda";
import { Board } from "./board";
import { match } from "ts-pattern";

type CellContext = {
  isLive: boolean;
  neighborCount: number;
};

/**
 * When a live cell's surroundings are underpopulated, it dies.
 */
const isUnderpopulated = ({ isLive, neighborCount }: CellContext) =>
  isLive && neighborCount <= 1;

/**
 * When a live cell's surroundings are overpopulated, it dies.
 */
const isOverpopulated = ({ isLive, neighborCount }: CellContext) =>
  isLive && neighborCount >= 4;

/**
 * When a dead cell has precisely 3 neighbours, a new cell is born.
 */
const canReproduce = ({ isLive, neighborCount }: CellContext) =>
  !isLive && neighborCount === 3;

/**
 * Given a board, calculates the next state of the board based on the births and deaths
 * following from the current state.
 */
export const nextGeneration = (board: Board): Board => {
  const isAliveAfterTick = ({ isLive, neighborCount }: CellContext) =>
    match({ isLive, neighborCount })
      .when(isUnderpopulated, () => false)
      .when(isOverpopulated, () => false)
      .when(canReproduce, () => true)
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
