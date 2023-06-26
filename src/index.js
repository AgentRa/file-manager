import { argv, stdin as input } from "node:process";
import { homedir } from "node:os";
import { emitter } from "./emitter.js";
import { parse, path, user } from "./utils/index.js";
import library from "./library/index.js";
import readline from "node:readline/promises";

const FileManager = {
  pathToWorkingDirectory: homedir(),
  username: user.geNameFrom(argv),
  emitter,
};

user.greet(FileManager.username);
path.youAreHere(FileManager.pathToWorkingDirectory);

const commandLine = readline.createInterface({ input });
commandLine.on("line", async (line) => {
  if (line.trim() === ".exit") commandLine.emit("SIGINT");

  try {
    const { module, command, lineArguments } = parse.toParameters(line);
    await library[module][command](lineArguments, FileManager);
  } catch (error) {
    emitter.console(error);
  } finally {
    path.youAreHere(FileManager.pathToWorkingDirectory);
  }
});

commandLine.on("SIGINT", () => {
  user.goodbye(FileManager.username);
  process.exit(0);
});
