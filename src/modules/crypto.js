import { readFile, lstat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { path } from "../utils/index.js";

const hash = async (lineArguments, application) => {
  const pathToFile = lineArguments.pop();

  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  const filetype = (await lstat(source)).isFile();

  if (!filetype) throw new Error("Operation failed");

  try {
    const file = await readFile(source);
    const hash = createHash("sha256").update(file).digest("hex");

    console.log(hash);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

export { hash };
