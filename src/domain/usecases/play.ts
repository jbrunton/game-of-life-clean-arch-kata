import { Game } from "entities/game";

type PlayParams = {
  maxTurns: number;
  delayMs: number;
  onTurn: (game: Game, prevTurn?: Game) => void;
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
  onTurn(game, prevTurn);

  await delay(delayMs);

  play(game.nextGeneration(), { maxTurns, delayMs, onTurn }, [
    ...history,
    game,
  ]);
};

const delay = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));
