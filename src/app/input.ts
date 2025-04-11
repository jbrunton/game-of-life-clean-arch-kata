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
  state: SelectionState = {
    board: new Board(width, height, []),
    cursor: { x: 0, y: 0 },
  },
): Promise<Board> => {
  const { board, cursor } = state;

  const isSelected = (cell: Cell) => isDeepEqual(cell, cursor);

  const invertSelection = () => {
    const liveCells = board.isLive(cursor)
      ? board.liveCells.filter((cell) => !isSelected(cell))
      : [...board.liveCells, { ...cursor }];

    return {
      board: new Board(board.width, board.height, liveCells),
      cursor,
    };
  };

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

  const getNextState = async () => {
    const keyName = await awaitInput();
    if (keyName === "space") {
      return invertSelection();
    } else if (keyName === "left") {
      return {
        board,
        cursor: {
          ...cursor,
          x: Math.max(0, cursor.x - 1),
        },
      };
    } else if (keyName === "right") {
      return {
        board,
        cursor: {
          ...cursor,
          x: Math.min(board.width - 1, cursor.x + 1),
        },
      };
    } else if (keyName === "up") {
      return {
        board,
        cursor: {
          ...cursor,
          y: Math.max(0, cursor.y - 1),
        },
      };
    } else if (keyName === "down") {
      return {
        board,
        cursor: {
          ...cursor,
          y: Math.min(board.height - 1, cursor.y + 1),
        },
      };
    } else if (keyName === "return") {
      return "done";
    }
  };

  const nextState = await getNextState();

  if (nextState === "done") {
    return board;
  }

  return getInitialBoard(width, height, nextState);
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
