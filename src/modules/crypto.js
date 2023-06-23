import { readFile, lstat } from "node:fs/promises";
import { createHash } from "node:crypto";
import {path} from "../utils/index.js";

const hash = async (commandArguments, application) => {
  const source = path.create(commandArguments[0], application.pathToWorkingDirectory)
  const isFile = (await lstat(source)).isFile();

  if (!isFile) throw new Error('Operation failed')

  try {
    const file = await readFile(source);
    const hash = createHash("sha256").update(file).digest("hex", file);

    console.log(hash);
  } catch (error) {
    application.emitter.throw(error.message)
  }
};

export { hash };
