import { lstat } from "node:fs/promises";

const argumentLength = (lineArguments, expectedLength) => {
  if (lineArguments.length !== expectedLength) {
    throw new Error(
      `Invalid input: wrong number of arguments provided, expected ${expectedLength} but received ${lineArguments.length}`
    );
  }
  return true;
};

const fileType = async (filePath) => {
  const stats = await lstat(filePath);
  if (!stats.isFile()) {
    throw new Error(`${filePath} is not file type`);
  }
};

const directoryType = async (directoryPath) => {
  const stats = await lstat(directoryPath);
  if (!stats.isDirectory()) {
    throw new Error(`${directoryPath} is not directory type}`);
  }
};

export { argumentLength, fileType, directoryType };
