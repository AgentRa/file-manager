import * as readline from "node:readline/promises";
import { argv, stdin as input, stdout as output } from "node:process";
import { youNameIt, goodbyeUser } from "./utils/index.js";
const commandLineInput = readline.createInterface({ input, output });
commandLineInput.on("line", (line) => {
  if (line.trim() === ".exit") {
    commandLineInput.emit("SIGINT");
  }
});

commandLineInput.on("SIGINT", () => {
  goodbyeUser(youNameIt(argv));
  process.exit(0);
});

commandLineInput.on("error", () => {
  console.log("Operation failed");
});

commandLineInput.on("line_parsed", (event) => {
  console.log("event", event);
});

export { commandLineInput };
