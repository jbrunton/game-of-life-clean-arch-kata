import { Game } from "entities/game";
import { isDeepEqual } from "remeda";

type PlayParams = {
  maxTurns: number;
  onTurn: (game: Game, turn: number, prevTurn?: Game) => Promise<void>;
  onFinish: (game: Game, stable: boolean, turn: number, cycle?: Game[]) => void;
};

export const play = async (
  game: Game,
  { maxTurns, onTurn, onFinish }: PlayParams,
  history: Game[] = [],
) => {
  if (history.length === maxTurns) {
    onFinish(game, false, history.length);
    return;
  }

  const prevTurn = history[history.length - 1];
  const stable = isDeepEqual(game, prevTurn);

  if (stable) {
    onFinish(game, true, history.length);
    return;
  }

  const cycle = findCycle(history);

  if (cycle) {
    onFinish(game, false, history.length, cycle);
    return;
  }

  await onTurn(game, history.length + 1, prevTurn);

  play(game.nextGeneration(), { maxTurns, onTurn, onFinish }, [
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
