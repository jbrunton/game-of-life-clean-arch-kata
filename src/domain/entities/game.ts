export type Cell = {
  x: number;
  y: number;
};

const cellKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

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
}
