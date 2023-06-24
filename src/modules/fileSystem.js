import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, rename, lstat, copyFile, unlink } from "node:fs/promises";
import { path } from "../utils/index.js";

const validateArgumentLength = (lineArguments, expectedLength) => {
  if (lineArguments.length !== expectedLength) {
    throw new Error(`Operation failed: wrong number of arguments`);
  }
};

const validateFileType = async (filePath) => {
  const stats = await lstat(filePath);
  if (!stats.isFile()) {
    throw new Error(`invalid file type`);
  }
};

const validateDirectoryType = async (directoryPath) => {
  const stats = await lstat(directoryPath);
  if (!stats.isDirectory()) {
    throw new Error(`invalid directory type`);
  }
};

const cat = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 1);

  const pathToFile = lineArguments.pop();
  const source = path.create(application.pathToWorkingDirectory, pathToFile);

  const readStream = createReadStream(source);
  const readStreamPromiseEnd = new Promise((resolve, reject) => {
    readStream.on("end", () => resolve());
    readStream.on("error", (error) => reject(error));
  });
  try {
    readStream.pipe(process.stdout);

    await readStreamPromiseEnd;
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};
const add = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 1);

  const newFileName = lineArguments.pop();
  const destination = path.create(
    application.pathToWorkingDirectory,
    newFileName
  );
  try {
    await writeFile(destination, "", { flag: "wx" });
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};
const rn = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 2);

  const [oldFileName, newFileName] = lineArguments;
  const oldPath = path.create(application.pathToWorkingDirectory, oldFileName);
  const newPath = path.create(application.pathToWorkingDirectory, newFileName);
  try {
    await rename(oldPath, newPath);
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};
const cp = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 2);

  const [pathToFile, pathToNewDirectory] = lineArguments;
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  const destination = path.create(
    application.pathToWorkingDirectory,
    pathToNewDirectory
  );
  const filename = "/" + source.split("/").pop();
  try {
    await validateFileType(source);
    await validateDirectoryType(destination);
    await copyFile(source, destination.concat(filename));
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};
const mv = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 2);

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
    await validateFileType(source);
    await validateDirectoryType(destination);

    readStream.pipe(writeStream);

    await readStreamEndPromise;
    await unlink(source);
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};
const rm = async (lineArguments, application) => {
  validateArgumentLength(lineArguments, 1);

  const pathToFile = lineArguments.pop();
  const source = path.create(application.pathToWorkingDirectory, pathToFile);
  try {
    await validateFileType(source);
    await unlink(source);
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};

export { cat, add, rn, cp, mv, rm };
