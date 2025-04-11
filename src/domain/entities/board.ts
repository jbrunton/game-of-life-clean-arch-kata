import { flat, times } from "remeda";

export type Cell = {
  x: number;
  y: number;
};

const cellKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

/**
 * Represents the state of a universe in Conway's Game of Life at a given moment in time. A board
 * has a finite list of live cells and may be compared for equality against other states of the
 * universe.
 */
export class Board {
  /**
   * A map of live cells. This could be a set, but it saves parsing strings back into cells.
   */
  private readonly liveCellsMap: Map<string, Cell>;

  constructor(
    readonly width: number,
    readonly height: number,
    liveCells: Cell[],
  ) {
    this.liveCellsMap = new Map(
      liveCells.map((cell) => {
        if (cell.x < 0 || cell.x >= width || cell.y < 0 || cell.y >= height) {
          throw new Error(`Invalid cell coordinates: ${cell.x},${cell.y}`);
        }
        return [cellKey(cell), cell];
      }),
    );
  }

  isLive(cell: Cell): boolean {
    return this.liveCellsMap.get(cellKey(cell)) !== undefined;
  }

  mapCells<T>(f: (isLive: boolean, cell: Cell) => T): T[][] {
    return times(this.height, (y) =>
      times(this.width, (x) => {
        const cell = { x, y };
        return f(this.isLive(cell), cell);
      }),
    );
  }

  getNeighbors({ x, y }: Cell): Cell[] {
    const yOffsets = [-1, 0, 1];
    const xOffsets = (yOffset: number) =>
      yOffset === 0 ? [-1, 1] : [-1, 0, 1];

    return flat(
      yOffsets.map((yOffset) =>
        xOffsets(yOffset).map((xOffset) => ({
          x: x + xOffset,
          y: y + yOffset,
        })),
      ),
    );
  }

  get liveCells(): Cell[] {
    return Array.from(this.liveCellsMap.values());
  }
}
