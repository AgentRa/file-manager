import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { path, validate } from "../utils/index.js";
const compress = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [fileToZip, directoryPath] = lineArguments;
  const workingDirectoryPath = application.pathToWorkingDirectory;

  const source = path.create(workingDirectoryPath, fileToZip);
  const destination = path.create(workingDirectoryPath, directoryPath);
  const zipPath = path.zip(source);

  const inputStream = createReadStream(source);
  const outputStream = createWriteStream(destination.concat(zipPath));
  const zip = createBrotliCompress();
  try {
    await validate.fileType(source);
    await validate.directoryType(destination);
    await pipeline(inputStream, zip, outputStream);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

const decompress = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [fileToUnzip, directoryPath] = lineArguments;
  const workingDirectoryPath = application.pathToWorkingDirectory;

  const source = path.create(workingDirectoryPath, fileToUnzip);
  const destination = path.create(workingDirectoryPath, directoryPath);
  const filePath = path.unzip(source);

  const input = createReadStream(source);
  const output = createWriteStream(destination.concat(filePath));
  const unzip = createBrotliDecompress();
  try {
    await validate.fileType(source);
    await validate.directoryType(destination);
    await pipeline(input, unzip, output);
  } catch (error) {
    application.emitter.throw(`Operation failed: ${error.message}`);
  }
};

export { compress, decompress };
