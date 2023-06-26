import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, rename, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { path, validate } from "../utils/index.js";

const cat = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const source = path.create(
    application.pathToWorkingDirectory,
    lineArguments.pop()
  );

  try {
    const readStream = createReadStream(source);
    // const readStreamPromiseEnd = new Promise((resolve, reject) => {
    //   readStream.on("end", () => resolve());
    //   readStream.on("error", (error) => reject(error.message));
    // });

    await pipeline(readStream, process.stdout);
    // await readStreamPromiseEnd;
  } catch (error) {
    application.emitter.throw(error);
  }
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
    application.emitter.throw(error);
  }
};
const rn = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [oldFileName, newFileName] = lineArguments;
  const oldPath = path.create(application.pathToWorkingDirectory, oldFileName);
  const newPath = path.create(application.pathToWorkingDirectory, newFileName);
  try {
    await validate.fileType(oldPath);
    await validate.fileType(newPath);
    await rename(oldPath, newPath);
  } catch (error) {
    application.emitter.throw(error);
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
  try {
    await validate.fileType(source);
    await validate.directoryType(destination);

    const readStream = createReadStream(source);
    const writeStream = createWriteStream(destination.concat(filename));
    const readStreamEndPromise = new Promise((resolve, reject) => {
      readStream.on("end", () => {
        resolve();
      });
      readStream.on("error", (error) => {
        reject(error.message);
      });
    });

    await pipeline(readStream, writeStream);
    await readStreamEndPromise;
  } catch (error) {
    application.emitter.throw(error);
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

  const readStream = createReadStream(source);
  const writeStream = createWriteStream(destination.concat(filename));

  const readStreamEndPromise = new Promise((resolve, reject) => {
    readStream.on("end", () => {
      resolve();
    });

    readStream.on("error", (error) => {
      reject(error);
    });
  });
  try {
    await validate.fileType(source);
    await validate.directoryType(destination);
    await pipeline(readStream, writeStream);
    await readStreamEndPromise;
    await unlink(source);
  } catch (error) {
    application.emitter.throw(error);
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
    application.emitter.throw(new Error(error.message));
  }
};

export { cat, add, rn, cp, mv, rm };
