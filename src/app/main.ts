import { input } from "@inquirer/prompts";
import { getGreeting } from "usecases/greet";

const main = async () => {
  const name = await input({
    message: "Hello, who are you?",
    default: "World",
  });

  const greeting = getGreeting({ name });

  console.info(greeting);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
