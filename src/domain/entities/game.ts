import { flat, isNonNullish, times } from "remeda";
import seedrandom from "seedrandom";

export type Cell = {
  x: number;
  y: number;
};

const cellKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

type SeedParams = {
  width: number;
  height: number;
  seed: number;
  cellCount: number;
};

export class Game {
  readonly gridMap: Map<string, Cell>;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly cells: Cell[],
  ) {
    this.gridMap = new Map(
      cells.map((cell) => {
        if (cell.x < 0 || cell.x >= width || cell.y < 0 || cell.y >= height) {
          throw new Error(`Invalid cell coordinates: ${cell.x},${cell.y}`);
        }
        return [cellKey(cell), cell];
      }),
    );
  }

  isLive(x: number, y: number): boolean {
    return this.gridMap.get(cellKey({ x, y })) !== undefined;
  }

  nextGeneration(): Game {
    const countNeighbors = (x: number, y: number) => {
      return [
        this.isLive(x - 1, y - 1),
        this.isLive(x, y - 1),
        this.isLive(x + 1, y - 1),

        this.isLive(x - 1, y),
        this.isLive(x + 1, y),

        this.isLive(x - 1, y + 1),
        this.isLive(x, y + 1),
        this.isLive(x + 1, y + 1),
      ].filter((live) => live === true).length;
    };

    const cells = flat(
      times(this.height, (y) =>
        flat(
          times(this.width, (x) => {
            const neighborCount = countNeighbors(x, y);
            if (this.isLive(x, y)) {
              return [2, 3].includes(neighborCount) ? { x, y } : null;
            } else {
              return neighborCount === 3 ? { x, y } : null;
            }
          }).filter(isNonNullish),
        ),
      ),
    );

    return new Game(this.width, this.height, cells);
  }

  static seed({ width, height, seed, cellCount }: SeedParams): Game {
    const rng = seedrandom(seed.toString());

    const cells = times(cellCount, () => {
      const x = randomNumber(width, rng);
      const y = randomNumber(height, rng);
      return { x, y };
    });

    return new Game(width, height, cells);
  }
}

const randomNumber = (k: number, rng: seedrandom.PRNG) => Math.floor(rng() * k);
