import { lstat } from "node:fs/promises";

const argumentLength = (lineArguments, expectedLength) => {
  if (lineArguments.length !== expectedLength) {
    throw new Error(`Invalid input: wrong number of arguments`);
  }
  return true;
};

const fileType = async (filePath) => {
  const stats = await lstat(filePath);
  if (!stats.isFile()) {
    throw new Error(`invalid file type ${filePath}`);
  }
  return true;
};

const directoryType = async (directoryPath) => {
  const stats = await lstat(directoryPath);
  if (!stats.isDirectory()) {
    throw new Error(`invalid directory type`);
  }
  return true;
};

export { argumentLength, fileType, directoryType };
