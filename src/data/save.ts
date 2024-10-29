import { Cell, Game } from "entities/game";
import { db } from "./config";

export type SavedGame = {
  name: string;
  seedState: { width: number; height: number; liveCells: Cell[] };
};

export const init = async () => {
  await db.raw(
    `
    CREATE TABLE IF NOT EXISTS saved_games (
      name VARCHAR(100) PRIMARY KEY,
      seedState JSONB NOT NULL
    )
    `,
  );
};

export const drop = async () => {
  await db.raw(
    `
    DROP TABLE saved_games;
    `,
  );
};

export const saveGame = async (name: string, game: Game) => {
  const seedState = JSON.stringify({
    width: game.width,
    height: game.height,
    liveCells: game.liveCells,
  });

  await db("saved_games").insert({
    name,
    seedState,
  });
};

export const listGames = async (): Promise<SavedGame[]> => {
  const games = await db("saved_games").select("*");
  return games.map((game) => ({
    ...game,
    seedState: JSON.parse(game.seedState),
  }));
};

export const getSavedGame = async (name: string): Promise<Game> => {
  const savedGame = await db("saved_games").select("*").where({ name }).first();

  const seedState = JSON.parse(savedGame.seedState) as SavedGame["seedState"];

  return new Game(seedState.width, seedState.height, seedState.liveCells);
};
