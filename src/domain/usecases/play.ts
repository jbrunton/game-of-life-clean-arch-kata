import { Board } from "entities/board";
import { isDeepEqual } from "remeda";

export type PlayParams = {
  maxTurns: number;
  loop: boolean;
  onTurn?: (game: Board, turn: number, prevTurn?: Board) => Promise<void>;
};

export type PlayResult = {
  game: Board;
  settled: boolean;
  turn: number;
  cycle?: Board[];
};

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
    const cycle = findCycle(history);

    if (cycle) {
      return { game, settled: false, turn, cycle };
    }
  }

  if (onTurn) {
    await onTurn(game, history.length + 1, prevTurn);
  }

  return play(game.nextGeneration(), { maxTurns, loop, onTurn }, [
    ...history,
    game,
  ]);
};

const findCycle = (history: Board[], size = 2) => {
  // we need space for at least two cycles
  if (size > history.length / 2) {
    return null;
  }

  const cycle1 = history.slice(history.length - size, history.length);
  const cycle2 = history.slice(
    history.length - size * 2,
    history.length - size,
  );

  if (isDeepEqual(cycle1, cycle2)) {
    return cycle1;
  }

  return findCycle(history, size + 1);
};
