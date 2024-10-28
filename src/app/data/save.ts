import { Cell, Game } from "entities/game";
import { Database } from "sqlite3";

const db = new Database("data/db.sqlite");

export type SavedGame = {
  name: string;
  seedState: { width: number; height: number; liveCells: Cell[] };
};

type SavedGameRecord = {
  name: string;
  seedState: string;
};

export const init = async () => {
  await db.exec(
    `
    CREATE TABLE IF NOT EXISTS saved_games (
      name VARCHAR(100) PRIMARY KEY,
      seedState JSONB NOT NULL
    )
    `,
  );
};

export const drop = async () => {
  await db.exec(
    `
    DROP TABLE saved_games;
    `,
  );
};

export const saveGame = async (name: string, game: Game) => {
  const $seedState = JSON.stringify({
    width: game.width,
    height: game.height,
    liveCells: game.liveCells,
  });

  await db.run(
    `
    INSERT INTO saved_games(name,seedState)
    VALUES($name,$seedState)
    `,
    {
      $name: name,
      $seedState,
    },
  );
};

const getAll = <T>(query: string): Promise<T[]> =>
  new Promise<T[]>((resolve, reject) => {
    db.all<T>(query, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

const get = <T>(query: string, params: Record<string, unknown>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    db.get<T>(query, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

export const listGames = async (): Promise<SavedGame[]> => {
  const games = await getAll<SavedGameRecord>("SELECT * FROM saved_games;");
  return games.map((game) => ({
    ...game,
    seedState: JSON.parse(game.seedState),
  }));
};

export const getSavedGame = async (name: string): Promise<Game> => {
  const savedGame = await get<SavedGameRecord>(
    "SELECT * FROM saved_games WHERE name = $name",
    {
      $name: name,
    },
  );

  console.info({ name, savedGame });

  const seedState = JSON.parse(savedGame.seedState) as SavedGame["seedState"];

  return new Game(seedState.width, seedState.height, seedState.liveCells);
};
