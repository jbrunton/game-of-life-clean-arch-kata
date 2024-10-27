import { Game } from "entities/game";
import { printFrame } from "./output";
import readline from "readline";
import { times } from "remeda";

export const getInitialBoard = async () => {
  let game = new Game(10, 10, []);
  let cursorX = 0;
  let cursorY = 0;

  const screenHeight = game.height + 1;

  const renderFrame = () => {
    return times(game.height, (y) =>
      times(game.width, (x) => {
        if (x === cursorX && y === cursorY) {
          return game.isLive(x, y) ? "∅" : "+";
        }
        return game.isLive(x, y) ? "●" : " ";
      }).join(" "),
    ).join("\n");
  };

  process.stdout.write("\u001Bc");
  const frame = renderFrame();

  printFrame(frame, {
    clearScreen: true,
    screenHeight,
    header: `Select the initial cells. Navigate with arrows. Space to flip state. Enter to accept. (${cursorX},${cursorY})`,
    delayMs: 0,
  });

  // await delay(1000);
  await awaitInputs((keyName) => {
    if (keyName === "space") {
      game = new Game(
        game.width,
        game.height,
        game.isLive(cursorX, cursorY)
          ? game.cells.filter(
              (cell) => cell.x !== cursorX || cell.y !== cursorY,
            )
          : [...game.cells, { x: cursorX, y: cursorY }],
      );
    } else if (keyName === "left") {
      cursorX = Math.max(0, cursorX - 1);
    } else if (keyName === "right") {
      cursorX = Math.min(game.width - 1, cursorX + 1);
    } else if (keyName === "up") {
      cursorY = Math.max(0, cursorY - 1);
    } else if (keyName === "down") {
      cursorY = Math.min(game.height - 1, cursorY + 1);
    }

    const frame = renderFrame();
    printFrame(frame, {
      clearScreen: true,
      screenHeight,
      header: `Select the initial cells. Navigate with arrows. Space to flip state. Enter to accept.`,
      delayMs: 0,
    });

    //console.info(keyName);
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

// const keypress = async () => {
//   process.stdin.setRawMode(true);
//   return new Promise((resolve) =>
//     process.stdin.once("data", (data) => {
//       console.info(data);
//       // const byteArray = [...data];
//       // if (byteArray.length > 0 && byteArray[0] === 3) {
//       //   console.log("^C");
//       //   process.exit(1);
//       // }
//       process.stdin.setRawMode(false);
//       process.stdin.pause();
//       resolve(null);
//     }),
//   );
// };

// const waitForInput = async () => {
//   process.stdin.setRawMode(true);
//   return new Promise((resolve) =>
//     process.stdin.on("key", (str, key) => {
//       process.stdin.setRawMode(false);
//       resolve(key.name);
//     }),
//   );
// };
