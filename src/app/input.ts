import { Board, Cell } from "entities/board";
import { printFrame } from "./output";
import readline from "readline";
import { renderCells } from "usecases/render";
import { clamp, isDeepEqual, times } from "remeda";
import { match, P } from "ts-pattern";

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

/**
 * Recursively gets the selected state from the user.
 *
 * In each recursive call we await for user input and then update the state accordingly. A return
 * means the user has finished selecting the initial state; arrow keys may be used to move the
 * cursor; and space to toggle the cell state at the cursor.
 */
const getSelection = async (state: SelectionState) => {
  printSelection(state);

  const keyName = await awaitNextInput();

  if (keyName === "return") {
    return state.board;
  }

  const nextState = match({ state, keyName })
    .with({ keyName: "space", state: P.select() }, invertSelection)
    .with({ keyName: "left", state: P.select() }, moveCursor({ x: -1, y: 0 }))
    .with({ keyName: "right", state: P.select() }, moveCursor({ x: 1, y: 0 }))
    .with({ keyName: "up", state: P.select() }, moveCursor({ x: 0, y: -1 }))
    .with({ keyName: "down", state: P.select() }, moveCursor({ x: 0, y: 1 }))
    .exhaustive();

  return getSelection(nextState);
};

const isSelected = (cell: Cell, state: SelectionState) =>
  isDeepEqual(cell, state.cursor);

/**
 * Prints the selection state to the screen. This shows the board with a cursor which can be moved.
 */
const printSelection = (state: SelectionState) => {
  const { board, cursor } = state;

  const screenHeight = board.height + 3;

  const frame = renderCells(board, (isLive, cell) => {
    if (isLive) {
      return isSelected(cell, state) ? "∅" : "●";
    } else {
      return isSelected(cell, state) ? "+" : " ";
    }
  });

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

/**
 * Inverts the cell at the cursor, i.e. if the selected cell is live it is toggled to dead, and
 * vice versa.
 */
const invertSelection = (state: SelectionState) => {
  const { board, cursor } = state;

  const liveCells = board.isLive(cursor)
    ? board.liveCells.filter((cell) => !isSelected(cell, state))
    : [...board.liveCells, { ...cursor }];

  return {
    board: new Board(board.width, board.height, liveCells),
    cursor,
  };
};

/**
 * Moves the cursor by the delta.
 */
const moveCursor =
  (delta: Cell) =>
  ({ cursor, board }: SelectionState) => {
    const x = clamp(cursor.x + delta.x, { min: 0, max: board.width - 1 });
    const y = clamp(cursor.y + delta.y, { min: 0, max: board.height - 1 });
    return { board, cursor: { x, y } };
  };

const inputKeys = ["left", "right", "up", "down", "space", "return"] as const;
type InputKey = (typeof inputKeys)[number];

/**
 * Awaits the next input key of interest, as defined by `inputKeys`. Other keys are ignored, except
 * for Ctrl+C which exits the process.
 */
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
