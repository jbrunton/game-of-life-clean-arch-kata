import { describe, it, expect } from "@jest/globals";
import { Board } from "./board";
import { asString, dedent } from "fixtures/game";
import { reverse } from "remeda";

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

  describe("equality", () => {
    const referenceCells = [
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ];

    const referenceBoard = new Board(3, 3, referenceCells);

    it("is equal to another board with the same live cells and dimensions", () => {
      expect(referenceBoard).toEqual(new Board(3, 3, referenceCells));
    });

    it("is equal to another board with the same live cells ordered differently", () => {
      expect(referenceBoard).toEqual(new Board(3, 3, reverse(referenceCells)));
    });

    it("is not equal when the dimensions are different", () => {
      expect(referenceBoard).not.toEqual(new Board(4, 3, referenceCells));
    });

    it("is not equal when the cells are different", () => {
      expect(referenceBoard).not.toEqual(new Board(3, 3, []));
    });
  });
});
