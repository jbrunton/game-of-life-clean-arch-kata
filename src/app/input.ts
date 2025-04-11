import { Board, Cell } from "entities/board";
import { printFrame } from "./output";
import readline from "readline";
import { renderCells } from "usecases/render";
import { isDeepEqual, times } from "remeda";

export const getInitialBoard = async (
  width: number,
  height: number,
  game = new Board(width, height, []),
  cursor: Cell = { x: 0, y: 0 },
): Promise<Board> => {
  const isSelected = (cell: Cell) => isDeepEqual(cell, cursor);

  const invertSelection = () => {
    const liveCells = game.isLive(cursor)
      ? game.liveCells.filter((cell) => !isSelected(cell))
      : [...game.liveCells, { ...cursor }];

    return getInitialBoard(
      width,
      height,
      new Board(game.width, game.height, liveCells),
      cursor,
    );
  };

  const screenHeight = game.height + 3;

  const renderFrame = () => {
    return renderCells(game, (isLive, cell) => {
      if (isLive) {
        return isSelected(cell) ? "∅" : "●";
      } else {
        return isSelected(cell) ? "+" : " ";
      }
    });
  };

  process.stdout.write("\u001Bc");

  const printSelection = () => {
    const frame = renderFrame();
    printFrame(frame, {
      clearScreen: true,
      screenHeight,
      header:
        "Select initial cells. Navigate with arrows. Space to flip state. Enter to accept.",
      delayMs: 0,
    });
    console.log(times(width, () => "=").join(" "));
    console.info(`(${cursor.x},${cursor.y})`);
  };

  printSelection();

  const keyName = await awaitInput();
  if (keyName === "space") {
    return invertSelection();
  } else if (keyName === "left") {
    return getInitialBoard(width, height, game, {
      ...cursor,
      x: Math.max(0, cursor.x - 1),
    });
  } else if (keyName === "right") {
    return getInitialBoard(width, height, game, {
      ...cursor,
      x: Math.min(game.width - 1, cursor.x + 1),
    });
  } else if (keyName === "up") {
    return getInitialBoard(width, height, game, {
      ...cursor,
      y: Math.max(0, cursor.y - 1),
    });
  } else if (keyName === "down") {
    return getInitialBoard(width, height, game, {
      ...cursor,
      y: Math.min(game.height - 1, cursor.y + 1),
    });
  } else if (keyName === "return") {
    return game;
  }

  return getInitialBoard(width, height, game, cursor);
};

const awaitInput = async () => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  return new Promise<string>((resolve) => {
    process.stdin.on("keypress", (str, key) => {
      if (key.ctrl && key.name === "c") {
        console.info("^C");
        process.exit();
      }

      if (key.name === "return") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
      }

      resolve(key.name);
    });
  });
};
