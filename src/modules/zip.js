import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { path, validate } from "../utils/index.js";
const compress = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 2);

  const [filePath, directoryPath] = lineArguments;
  const workingDirectoryPath = application.pathToWorkingDirectory;

  const source = path.create(workingDirectoryPath, filePath);
  const destination = path.create(workingDirectoryPath, directoryPath);
  const destinationZip = destination.concat(path.zip(filePath));

  const inputStream = createReadStream(source);
  const outputStream = createWriteStream(destinationZip);
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
  const destinationUnzip = destination.concat(path.unzip(source));

  const input = createReadStream(source);
  const output = createWriteStream(destinationUnzip);
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
