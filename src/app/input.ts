import { Game } from "entities/game";
import { printFrame } from "./output";
import readline from "readline";
import { renderCells } from "usecases/render";
import { times } from "remeda";

export const getInitialBoard = async (width: number, height: number) => {
  let game = new Game(width, height, []);
  let cursorX = 0;
  let cursorY = 0;

  const invertSelection = () => {
    const liveCells = game.isLive(cursorX, cursorY)
      ? game.liveCells.filter(
          (cell) => cell.x !== cursorX || cell.y !== cursorY,
        )
      : [...game.liveCells, { x: cursorX, y: cursorY }];

    game = new Game(game.width, game.height, liveCells);
  };

  const screenHeight = game.height + 3;

  const renderFrame = () => {
    return renderCells(game, (isLive, { x, y }) => {
      const isSelected = x === cursorX && y === cursorY;
      return isLive ? (isSelected ? "∅" : "●") : isSelected ? "+" : " ";
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
    console.info(`(${cursorX},${cursorY})`);
  };

  printSelection();

  await awaitInputs((keyName) => {
    if (keyName === "space") {
      invertSelection();
    } else if (keyName === "left") {
      cursorX = Math.max(0, cursorX - 1);
    } else if (keyName === "right") {
      cursorX = Math.min(game.width - 1, cursorX + 1);
    } else if (keyName === "up") {
      cursorY = Math.max(0, cursorY - 1);
    } else if (keyName === "down") {
      cursorY = Math.min(game.height - 1, cursorY + 1);
    }

    printSelection();
  });

  return game;
};

const awaitInputs = async (onKeyPress: (keyName: string) => void) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  return new Promise<void>((resolve) => {
    process.stdin.on("keypress", (str, key) => {
      if (key.ctrl && key.name === "c") {
        console.info("^C");
        process.exit();
      }
      if (key.name === "return") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve();
      } else {
        onKeyPress(key.name);
      }
    });
  });
};
