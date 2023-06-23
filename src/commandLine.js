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
  user.goodbyeUser(user.youNameIt(argv));
  process.exit(0);
});

commandLine.on("error", () => {
  console.log("Operation failed");
});

export { commandLine };
