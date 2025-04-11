import { Board } from "entities/board";
import { nextGeneration } from "entities/generation";
import { isDeepEqual } from "remeda";

export type PlayParams = {
  /**
   * The maximum number of turns to play.
   */
  maxTurns: number;

  /**
   * Whether or not to loop when a cycle is entered. When set to false, the play function will
   * instead halt when a cycle is detected.
   */
  loop: boolean;
  onTurn?: (game: Board, turn: number, prevTurn?: Board) => Promise<void>;
};

export type PlayResult = {
  /**
   * The final game state.
   */
  game: Board;

  /**
   * Whether the game settled.
   */
  settled: boolean;

  /**
   * The final turn number.
   */
  turn: number;

  /**
   * When defined, the cycle of states the game has entered.
   */
  cycle?: Board[];
};

/**
 * Given an initial game state, plays Conway's Game of Life with the given parameters.
 */
export const play = async (
  game: Board,
  { maxTurns, onTurn, loop }: PlayParams,
  history: Board[] = [],
): Promise<PlayResult> => {
  const turn = history.length;

  if (turn === maxTurns) {
    return { game, settled: false, turn };
  }

  const prevTurn = history[history.length - 1];
  const settled = isDeepEqual(game, prevTurn);

  if (settled) {
    return { game, settled, turn };
  }

  if (!loop) {
    const cycle = detectCycle(history);

    if (cycle) {
      return { game, settled: false, turn, cycle };
    }
  }

  if (onTurn) {
    await onTurn(game, history.length + 1, prevTurn);
  }

  return play(nextGeneration(game), { maxTurns, loop, onTurn }, [
    ...history,
    game,
  ]);
};

/**
 * Detects cycles in the given history. Returns null if no cycle exists.
 *
 * The function starts by trying to detect a cycle of length 2, then recursively checks for cycles
 * of length size + 1.
 */
const detectCycle = (history: Board[], size = 2) => {
  const generations = history.length;

  // A cycle can be detected only if it has repeated at least once, so the maximum cycle length is
  // half the number of generations.
  if (size > generations / 2) {
    return null;
  }

  const candidate1 = history.slice(generations - size, generations);
  const candidate2 = history.slice(generations - size * 2, generations - size);

  if (isDeepEqual(candidate1, candidate2)) {
    return candidate1;
  }

  return detectCycle(history, size + 1);
};
