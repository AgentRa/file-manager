import { argv } from "node:process";
import { homedir } from "node:os";
import { parse, path, user } from "./utils/index.js";
import { commandLine } from "./commandLine.js";
import { emitter } from "./emitter.js";
import library from "./library/index.js";

const FileManager = {
  pathToWorkingDirectory: homedir(),
  username: user.geNameFrom(argv),
  emitter,
};

user.greet(FileManager.username);
path.youAreHere(FileManager.pathToWorkingDirectory);

commandLine.on("line", async (line) => {
  try {
    const { module, command, lineArguments } = parse.toParameters(line);
    await library[module][command](lineArguments, FileManager);
  } catch (error) {
    emitter.throw(error);
  } finally {
    path.youAreHere(FileManager.pathToWorkingDirectory);
  }
});
