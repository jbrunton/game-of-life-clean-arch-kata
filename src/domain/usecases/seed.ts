import { Board } from "entities/board";
import { times } from "remeda";
import seedrandom from "seedrandom";

type SeedParams = {
  width: number;
  height: number;
  seed: string;
  cellCount: number;
};

export const seedBoard = ({
  width,
  height,
  seed,
  cellCount,
}: SeedParams): Board => {
  const rng = seedrandom(seed.toString());

  const cells = times(cellCount, () => {
    const x = randomNumber(width, rng);
    const y = randomNumber(height, rng);
    return { x, y };
  });

  return new Board(width, height, cells);
};

const randomNumber = (k: number, rng: seedrandom.PRNG) => Math.floor(rng() * k);
