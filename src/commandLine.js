import * as readline from "node:readline/promises";
import { argv, stdin as input, stdout as output } from "node:process";
import { user } from "./utils/index.js";
const commandLine = readline.createInterface({ input, output });
commandLine.on("line", (line) => {
  if (line.trim() === ".exit") {
    commandLine.emit("SIGINT");
  }
});

commandLine.on("SIGINT", () => {
  user.goodbye(user.geNameFrom(argv));
  process.exit(0);
});

commandLine.on("error", (error) => {
  console.error(error.message);
});

export { commandLine };
