import { argv } from "node:process";
import { homedir } from "node:os";
import { parse, path, user } from "./utils/index.js";
import { commandLine } from "./commandLine.js";
import { emitter } from "./emitter.js";

const FileManager = {
  pathToWorkingDirectory: homedir(),
  username: user.geNameFrom(argv),
  emitter,
};

user.greet(FileManager.username);
path.youAreHere(FileManager.pathToWorkingDirectory);

commandLine.on("line", async (line) => {
  try {
    const { module, command, lineArguments } = parse.lineToVariables(
      line,
      FileManager.emitter
    );

    await FileManager.emitter.execute(
      module,
      command,
      lineArguments,
      FileManager
    );

    path.youAreHere(FileManager.pathToWorkingDirectory);
  } catch (error) {
    console.log(error.message);

    path.youAreHere(FileManager.pathToWorkingDirectory);
  }
});
