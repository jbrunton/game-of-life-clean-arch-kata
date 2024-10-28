import { play } from "./play";
import { describe, expect, it } from "@jest/globals";
import { fromString } from "fixtures/game";

const simpleCycle = fromString(`
  XX__
  XX__
  __XX
  __XX
`);

const simpleCycleAlternate = fromString(`
  XX__
  X___
  ___X
  __XX
`);

const simpleStabilisingGame = fromString(`
  XX_
  X_X
  X__
`);

const simpleStabilisedGame = fromString(`
  XX_
  XX_
  ___
`);

describe("play", () => {
  it("finishes after the specified number of turns", async () => {
    const result = await play(simpleCycle, { loop: true, maxTurns: 6 });
    expect(result).toEqual({ game: simpleCycle, settled: false, turn: 6 });
  });

  it("detects cycles", async () => {
    const result = await play(simpleCycle, { loop: false, maxTurns: 10 });
    expect(result).toEqual({
      game: simpleCycle,
      settled: false,
      turn: 4,
      cycle: [simpleCycle, simpleCycleAlternate],
    });
  });

  it("detects settled games", async () => {
    const result = await play(simpleStabilisingGame, {
      loop: false,
      maxTurns: 10,
    });
    expect(result).toEqual({
      game: simpleStabilisedGame,
      settled: true,
      turn: 4,
    });
  });
});
