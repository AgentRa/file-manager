import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, rename, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import { path, validate } from "../utils/index.js";
import { youAreHere } from "../utils/path.js";

const cat = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  let readStream;
  const source = path.create(
    application.pathToWorkingDirectory,
    lineArguments.pop()
  );

  try {
    await validate.fileType(source);
    readStream = createReadStream(source, { encoding: "utf-8" });
    readStream.pipe(stdout);
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  } finally {
    readStream?.emit("close");
  }

  readStream?.on("close", () => youAreHere(application.pathToWorkingDirectory));
};
const add = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const destination = path.create(
    application.pathToWorkingDirectory,
    lineArguments.pop()
  );
  try {
    await writeFile(destination, "", { flag: "wx" });
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  }
};
const rn = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [oldFileName, newFileName] = lineArguments;
  const oldPath = path.create(application.pathToWorkingDirectory, oldFileName);
  const newPath = path.create(application.pathToWorkingDirectory, newFileName);
  try {
    await validate.fileType(oldPath);
    await rename(oldPath, newPath);
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  }
};
const cp = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [pathToFile, pathToNewDirectory] = lineArguments;
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  const destination = path.create(
    application.pathToWorkingDirectory,
    pathToNewDirectory
  );
  const filename = "/" + source.split("/").pop();
  let readStream, writeStream;

  try {
    await validate.fileType(source);
    await validate.directoryType(destination);

    readStream = createReadStream(source);
    writeStream = createWriteStream(destination.concat(filename));

    await pipeline(readStream, writeStream);
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  } finally {
    readStream?.emit("close");
    writeStream?.emit("close");
  }
};
const mv = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [pathToFile, pathToNewDirectory] = lineArguments;
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  const destination = path.create(
    application.pathToWorkingDirectory,
    pathToNewDirectory
  );
  const filename = "/" + source.split("/").pop();
  let readStream, writeStream;

  try {
    await validate.fileType(source);
    await validate.directoryType(destination);

    readStream = createReadStream(source);
    writeStream = createWriteStream(destination.concat(filename));

    await pipeline(readStream, writeStream);
    await unlink(source);
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  } finally {
    readStream?.emit("close");
    writeStream?.emit("close");
  }
};
const rm = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const pathToFile = lineArguments.pop();
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  try {
    await validate.fileType(source);
    await unlink(source);
  } catch (error) {
    application.emitter.console(
      new Error(`Operation failed: ${error.message}`)
    );
  }
};

export { cat, add, rn, cp, mv, rm };
