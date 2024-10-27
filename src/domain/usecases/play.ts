import { Game } from "entities/game";
import { isDeepEqual } from "remeda";

type PlayParams = {
  maxTurns: number;
  onTurn: (game: Game, turn: number, prevTurn?: Game) => Promise<void>;
  onFinish: (game: Game, stable: boolean, turn: number) => void;
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

  await onTurn(game, history.length + 1, prevTurn);

  play(game.nextGeneration(), { maxTurns, onTurn, onFinish }, [
    ...history,
    game,
  ]);
};
