import { number } from "@inquirer/prompts";
import { Game } from "entities/game";
import { renderTurn } from "usecases/render";

const main = async () => {
  const width = await number({
    message: "Enter the board width",
    required: true,
  });

  const height = await number({
    message: "Enter the board height",
    required: true,
  });

  const seed = await number({ message: "seed", default: 0, required: true });

  const cellCount = await number({
    message: "How many cells do you want to seed the game with?",
    required: true,
  });

  const game = Game.seed({
    width: width!,
    height: height!,
    seed: seed!,
    cellCount: cellCount!,
  });

  console.info(renderTurn(game));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
