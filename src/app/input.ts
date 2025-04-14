import { Board, Cell } from "entities/board";
import { printFrame } from "./output";
import readline from "readline";
import { renderCells } from "usecases/render";
import { isDeepEqual, times } from "remeda";

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

  const renderFrame = () => {
    return renderCells(board, (isLive, cell) => {
      if (isLive) {
        return isSelected(cell) ? "∅" : "●";
      } else {
        return isSelected(cell) ? "+" : " ";
      }
    });
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

  const printSelection = () => {
    const frame = renderFrame();
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

  printSelection();

  // const getNextState = async () => {
  const keyName = await awaitNextInput();
  if (keyName === "space") {
    return getSelection(invertSelection());
  } else if (keyName === "left") {
    return getSelection({
      board,
      cursor: {
        ...cursor,
        x: Math.max(0, cursor.x - 1),
      },
    });
  } else if (keyName === "right") {
    return getSelection({
      board,
      cursor: {
        ...cursor,
        x: Math.min(board.width - 1, cursor.x + 1),
      },
    });
  } else if (keyName === "up") {
    return getSelection({
      board,
      cursor: {
        ...cursor,
        y: Math.max(0, cursor.y - 1),
      },
    });
  } else if (keyName === "down") {
    return getSelection({
      board,
      cursor: {
        ...cursor,
        y: Math.min(board.height - 1, cursor.y + 1),
      },
    });
  } else {
    return board;
  }
  // };

  // const nextState = await getNextState();

  // if (!nextState) {
  //   return board;
  // }

  // return getSelection(nextState);
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
