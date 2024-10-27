import { play } from "./play";
import { Game } from "entities/game";
import { describe, expect, it } from "@jest/globals";

const simpleCycle = new Game(4, 4, [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },

  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 3, y: 3 },
  { x: 2, y: 3 },
]);

const simpleCycleAlternate = new Game(4, 4, [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },

  { x: 3, y: 2 },
  { x: 3, y: 3 },
  { x: 2, y: 3 },
]);

const simpleStabilisingGame = new Game(4, 4, [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 0 },
  { x: 2, y: 1 },
]);

const simpleStabilisedGame = new Game(4, 4, [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
]);

describe("play", () => {
  it("finishes after the specified number of turns", async () => {
    const result = await play(simpleCycle, { loop: true, maxTurns: 6 });
    expect(result).toEqual({ game: simpleCycle, stable: false, turn: 6 });
  });

  it("detects cycles", async () => {
    const result = await play(simpleCycle, { loop: false, maxTurns: 10 });
    expect(result).toEqual({
      game: simpleCycle,
      stable: false,
      turn: 4,
      cycle: [simpleCycle, simpleCycleAlternate],
    });
  });

  it("detects stabilised games", async () => {
    const result = await play(simpleStabilisingGame, {
      loop: false,
      maxTurns: 10,
    });
    expect(result).toEqual({
      game: simpleStabilisedGame,
      stable: true,
      turn: 4,
    });
  });
});
