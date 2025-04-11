import { floor, isNonNullish, times } from "remeda";

export type Cell = {
  x: number;
  y: number;
};

const cellKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

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
    const cells = times(9, (i) => {
      const xOffset = (i % 3) - 1;
      const yOffset = floor(0)(i / 3) - 1;

      return xOffset === 0 && yOffset === 0
        ? undefined
        : { x: x + xOffset, y: y + yOffset };
    });

    return cells.filter(isNonNullish);
  }

  get liveCells(): Cell[] {
    return Array.from(this.liveCells.values());
  }
}
