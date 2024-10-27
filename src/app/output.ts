type PrintFrameParams = {
  clearScreen: boolean;
  screenHeight: number;
  header: string;
  delayMs: number;
};

export const printFrame = async (
  frame: string,
  { clearScreen, screenHeight, header, delayMs }: PrintFrameParams,
) => {
  if (clearScreen) {
    process.stdout.moveCursor(0, -screenHeight);
  }

  console.info(header);
  console.info(frame);

  await delay(delayMs);
};

export const delay = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));
