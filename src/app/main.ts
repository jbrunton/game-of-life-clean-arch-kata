import { number } from "@inquirer/prompts";
import { Game } from "entities/game";
import { playGame } from "./play";

const main = async () => {
  const width = await number({
    message: "Enter the board width",
    required: true,
    default: 10,
  });

  const height = await number({
    message: "Enter the board height",
    required: true,
    default: 10,
  });

  const seed = await number({ message: "seed", default: 0, required: true });

  const cellCount = await number({
    message: "How many cells do you want to seed the game with?",
    required: true,
    default: 20,
  });

  const game = Game.seed({
    width: width!,
    height: height!,
    seed: seed!,
    cellCount: cellCount!,
  });

  await playGame(game);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
