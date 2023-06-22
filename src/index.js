import { argv } from "node:process";
import { homedir } from "node:os";
import {
  youNameIt,
  greetUser,
  lineToVariablesParse,
  youAreHere,
  Emitter,
} from "./utils/index.js";
import { commandLineInput } from "./commandLineInput.js";

const FileManager = {
  pathToWorkingDirectory: homedir(),
  emitter: new Emitter(),
  application: this,
};

greetUser(youNameIt(argv));
youAreHere(FileManager.pathToWorkingDirectory);

commandLineInput.on("line", async (line) => {
  try {
    const { module, moduleCommand, commandArguments } = lineToVariablesParse(
      line,
      FileManager.emitter
    );

    await FileManager.emitter.execute(
      module,
      moduleCommand,
      commandArguments,
      FileManager
    );

    youAreHere(FileManager.pathToWorkingDirectory);
  } catch (error) {
    console.log(error.message);

    youAreHere(FileManager.pathToWorkingDirectory);
  }
});

FileManager.emitter.on("error", (error) => {
  throw new Error(error);
});
