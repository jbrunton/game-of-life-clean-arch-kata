import { flat, floor, isNonNullish, times } from "remeda";
import seedrandom from "seedrandom";

export type Cell = {
  x: number;
  y: number;
};

const cellKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

type SeedParams = {
  width: number;
  height: number;
  seed: string;
  cellCount: number;
};

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

  isLive(x: number, y: number): boolean {
    return this.liveCellsMap.get(cellKey({ x, y })) !== undefined;
  }

  mapCells<T>(f: (isLive: boolean, cell: Cell) => T): T[][] {
    return times(this.height, (y) =>
      times(this.width, (x) => f(this.isLive(x, y), { x, y })),
    );
  }

  getNeighbors(x: number, y: number): Cell[] {
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

  nextGeneration(): Board {
    const countNeighbors = (x: number, y: number) =>
      this.getNeighbors(x, y).filter((c) => this.isLive(c.x, c.y)).length;

    const isSustainablePopulation = (neighborCount: number) =>
      [2, 3].includes(neighborCount);

    const liveCells = this.mapCells((isLive, { x, y }) => {
      const neighborCount = countNeighbors(x, y);
      if (isLive) {
        return isSustainablePopulation(neighborCount) ? { x, y } : null;
      } else {
        return neighborCount === 3 ? { x, y } : null;
      }
    });

    return new Board(
      this.width,
      this.height,
      flat(liveCells).filter(isNonNullish),
    );
  }

  static seed({ width, height, seed, cellCount }: SeedParams): Board {
    const rng = seedrandom(seed.toString());

    const cells = times(cellCount, () => {
      const x = randomNumber(width, rng);
      const y = randomNumber(height, rng);
      return { x, y };
    });

    return new Board(width, height, cells);
  }
}

const randomNumber = (k: number, rng: seedrandom.PRNG) => Math.floor(rng() * k);
