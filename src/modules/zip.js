import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { path } from "../utils/index.js";
import { lstat } from "node:fs/promises";
const compress = async (lineArguments, application) => {
  if (lineArguments.length !== 2) throw new Error("Operation failed");

  const [fileToZip, directoryPath] = lineArguments;
  const workingDirectoryPath = application.pathToWorkingDirectory;

  const source = path.create(workingDirectoryPath, fileToZip);
  const destination = path.create(workingDirectoryPath, directoryPath);

  const sourceType = (await lstat(source)).isFile();
  const destinationType = (await lstat(destination)).isDirectory();

  if (!sourceType || !destinationType) throw new Error("Operation failed");

  try {
    const fileToZip = "/" + source.split("/").pop() + ".gz";
    const input = createReadStream(source);
    const output = createWriteStream(destination.concat(fileToZip));
    const zip = createBrotliCompress();

    await promisify(pipeline)(input, zip, output);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

const decompress = async (lineArguments, application) => {
  if (lineArguments.length !== 2) throw new Error("Operation failed");

  const [fileToUnzip, directoryPath] = lineArguments;
  const workingDirectoryPath = application.pathToWorkingDirectory;

  const source = path.create(workingDirectoryPath, fileToUnzip);
  const destination = path.create(workingDirectoryPath, directoryPath);

  const sourceType = (await lstat(source)).isFile();
  const destinationType = (await lstat(destination)).isDirectory();
  const zipType = source.substring(source.length - 3) === ".gz";

  if (!sourceType || !destinationType || !zipType)
    throw new Error("Operation failed");

  try {
    const fileToUnzip = "/" + source.split("/").pop().slice(0, -3);
    const input = createReadStream(source);
    const output = createWriteStream(destination.concat(fileToUnzip));
    const unzip = createBrotliDecompress();

    await promisify(pipeline)(input, unzip, output);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

export { compress, decompress };
