import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { path, validate } from "../utils/index.js";

const hash = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const pathToFile = lineArguments.pop();
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  try {
    await validate.fileType(source);

    const file = await readFile(source);
    const hash = createHash("sha256").update(file).digest("hex");

    console.log(hash);
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};

export { hash };
