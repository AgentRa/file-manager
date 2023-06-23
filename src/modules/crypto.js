import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createPath } from "../utils/path.js";

const hash = async (commandArguments, application) => {
  console.log("command", commandArguments);
  const pathToFile = commandArguments[0].startsWith(
    application.pathToWorkingDirectory
  )
    ? commandArguments[0]
    : createPath(application.pathToWorkingDirectory, commandArguments[0]);

  const isFile = (await stat(pathToFile)).isFile();

  console.log("pathToFile", pathToFile);
  console.log("isFile", isFile);

  // const sourceToFIle
  //
  // try {
  //   const file = await readFile(source);
  //   const hash = createHash("sha256").update(file).digest("hex");
  //   console.log(hash);
  // } catch (error) {
  //   application.emitter.throw("Operation failed");
  // }
};

export { hash };
