import { describe, expect, it } from "@jest/globals";
import { renderCells } from "./render";
import { Board } from "entities/board";
import { dedent } from "fixtures/game";

describe("renderCells", () => {
  it("renders cells on a game board", () => {
    const game = new Board(3, 3, [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);

    const frame = renderCells(game, (isLive) => (isLive ? "●" : "x"));

    const expectedBoard = dedent`
      ● x x
      x ● x
      x x x`;
    expect(frame).toEqual(expectedBoard);
  });
});

// describe("renderFrames", () => {
//   describe("when there was no previous turn", () => {
//     it("returns the next frame", () => {
//       const game = new Game(3, 3, [
//         { x: 0, y: 0 },
//         { x: 1, y: 1 },
//       ]);

//       const result = renderFrames(game);

//       const nextFrame = dedent`
//         ● x x
//         x ● x
//         x x x`;
//       expect(result).toEqual({
//         betweenFrame: undefined,
//         nextFrame,
//       });
//     });
//   });
// });
