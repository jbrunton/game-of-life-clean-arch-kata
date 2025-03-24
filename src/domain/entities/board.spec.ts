import { describe, it, expect } from "@jest/globals";
import { Board } from "./board";
import { asString, dedent } from "fixtures/game";

describe("Game", () => {
  describe("constructor", () => {
    it("initialises a valid game", () => {
      const game = new Board(3, 3, [{ x: 0, y: 0 }]);

      expect(asString(game)).toEqual(
        dedent`
          XOO
          OOO
          OOO
        `,
      );
    });

    it("validates cell coordinates", () => {
      expect(() => {
        new Board(3, 3, [{ x: 3, y: 0 }]);
      }).toThrowError("Invalid cell coordinates: 3,0");
    });
  });

  describe("isLive", () => {
    it("returns whether a given cell is live", () => {
      const game = new Board(3, 3, [{ x: 0, y: 0 }]);

      expect(game.isLive(0, 0)).toBeTruthy();
      expect(game.isLive(1, 0)).toBeFalsy();
      expect(game.isLive(0, 1)).toBeFalsy();
    });
  });
});
