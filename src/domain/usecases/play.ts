import { Game } from "entities/game";

type PlayParams = {
  maxTurns: number;
  delayMs: number;
  onTurn: (game: Game, prevTurn?: Game) => Promise<void>;
};

export const play = async (
  game: Game,
  { maxTurns, delayMs, onTurn }: PlayParams,
  history: Game[] = [],
) => {
  if (history.length === maxTurns) {
    return;
  }

  const prevTurn = history[history.length - 1];
  await onTurn(game, prevTurn);

  play(game.nextGeneration(), { maxTurns, delayMs, onTurn }, [
    ...history,
    game,
  ]);
};
