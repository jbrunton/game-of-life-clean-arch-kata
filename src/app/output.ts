type PrintFrameParams = {
  clearScreen: boolean;
  screenHeight: number;
  header: string;
};

export const printFrame = (
  frame: string,
  { clearScreen, screenHeight, header }: PrintFrameParams,
) => {
  if (clearScreen) {
    process.stdout.moveCursor(0, -screenHeight);
  }

  console.info(header);
  console.info(frame);
};
