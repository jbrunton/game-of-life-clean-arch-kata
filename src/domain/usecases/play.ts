import { Game } from "entities/game";
import { isDeepEqual } from "remeda";

type PlayParams = {
  maxTurns: number;
  loop: boolean;
  onTurn?: (game: Game, turn: number, prevTurn?: Game) => Promise<void>;
};

export type PlayResult = {
  game: Game;
  settled: boolean;
  turn: number;
  cycle?: Game[];
};

export const play = async (
  game: Game,
  { maxTurns, onTurn, loop }: PlayParams,
  history: Game[] = [],
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

const findCycle = (history: Game[], size = 2) => {
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
