import { Cell, Board } from "entities/board";
import { db } from "./db";

type SavedGame = {
  name: string;
  seedState: { width: number; height: number; liveCells: Cell[] };
  description?: string;
};

export const saveGame = async (
  name: string,
  game: Board,
  description?: string,
) => {
  const seedState = JSON.stringify({
    width: game.width,
    height: game.height,
    liveCells: game.liveCells,
  });

  await db("saved_games").insert({
    name,
    seedState,
    description,
  });
};

export const listGames = async (): Promise<SavedGame[]> => {
  const games = await db("saved_games").select("*");
  return games.map((game) => ({
    ...game,
    seedState: JSON.parse(game.seedState),
  }));
};

export const getSavedGame = async (name: string): Promise<Board> => {
  const savedGame = await db("saved_games").select("*").where({ name }).first();

  const seedState = JSON.parse(savedGame.seedState) as SavedGame["seedState"];

  return new Board(seedState.width, seedState.height, seedState.liveCells);
};
