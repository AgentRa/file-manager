import { argv } from "node:process";
import { homedir } from "node:os";
import { parse, path, user } from "./utils/index.js";
import { commandLine } from "./commandLine.js";
import { Emitter } from "./emitter.js";

const FileManager = {
  pathToWorkingDirectory: homedir(),
  emitter: new Emitter(),
  application: this,
};

user.greetUser(user.youNameIt(argv));
path.youAreHere(FileManager.pathToWorkingDirectory);

commandLine.on("line", async (line) => {
  try {
    const { module, moduleCommand, commandArguments } = parse.lineToVariables(
      line,
      FileManager.emitter
    );

    await FileManager.emitter.execute(
      module,
      moduleCommand,
      commandArguments,
      FileManager
    );

    path.youAreHere(FileManager.pathToWorkingDirectory);
  } catch (error) {
    console.log(error.message);

    path.youAreHere(FileManager.pathToWorkingDirectory);
  }
});

FileManager.emitter.on("error", (error) => {
  throw new Error(error);
});
