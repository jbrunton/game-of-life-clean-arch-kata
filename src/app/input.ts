import { Board, Cell } from "entities/board";
import { printFrame } from "./output";
import readline from "readline";
import { renderCells } from "usecases/render";
import { clamp, isDeepEqual, times } from "remeda";
import { match } from "ts-pattern";

type SelectionState = {
  board: Board;
  cursor: Cell;
};

export const getInitialBoard = async (
  width: number,
  height: number,
): Promise<Board> => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  const board = await getSelection({
    board: new Board(width, height, []),
    cursor: { x: 0, y: 0 },
  });

  process.stdin.setRawMode(false);
  process.stdin.pause();

  return board;
};

const getSelection = async ({ board, cursor }: SelectionState) => {
  const isSelected = (cell: Cell) => isDeepEqual(cell, cursor);

  const screenHeight = board.height + 3;

  const renderBoard = () => {
    return renderCells(board, (isLive, cell) => {
      if (isLive) {
        return isSelected(cell) ? "∅" : "●";
      } else {
        return isSelected(cell) ? "+" : " ";
      }
    });
  };

  const printSelection = () => {
    const frame = renderBoard();
    printFrame(frame, {
      clearScreen: true,
      screenHeight,
      header:
        "Select initial cells. Navigate with arrows. Space to flip state. Enter to accept.",
      delayMs: 0,
    });
    console.log(times(board.width, () => "=").join(" "));
    console.info(`(${cursor.x},${cursor.y})`);
  };

  const invertSelection = () => {
    const liveCells = board.isLive(cursor)
      ? board.liveCells.filter((cell) => !isSelected(cell))
      : [...board.liveCells, { ...cursor }];

    return {
      board: new Board(board.width, board.height, liveCells),
      cursor,
    };
  };

  const moveCursor = (delta: Cell) => {
    const x = clamp(cursor.x + delta.x, { min: 0, max: board.width - 1 });
    const y = clamp(cursor.y + delta.y, { min: 0, max: board.height - 1 });
    return { board, cursor: { x, y } };
  };

  printSelection();

  const keyName = await awaitNextInput();

  if (keyName === "return") {
    return board;
  }

  return getSelection(
    match(keyName)
      .with("space", () => invertSelection())
      .with("left", () => moveCursor({ x: -1, y: 0 }))
      .with("right", () => moveCursor({ x: 1, y: 0 }))
      .with("up", () => moveCursor({ x: 0, y: -1 }))
      .with("down", () => moveCursor({ x: 0, y: 1 }))
      .exhaustive(),
  );
};

const inputKeys = ["left", "right", "up", "down", "space", "return"] as const;
type InputKey = (typeof inputKeys)[number];

const awaitNextInput = async (): Promise<InputKey> => {
  return new Promise<InputKey>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (_str: any, key: any) => {
      if (key.ctrl && key.name === "c") {
        console.info("^C");
        process.exit();
      }

      if (inputKeys.includes(key.name)) {
        process.stdin.off("keypress", handler);
        resolve(key.name);
      }
    };

    process.stdin.on("keypress", handler);
  });
};
