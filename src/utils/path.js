import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const getFileName = (filePath) => fileURLToPath(filePath);
const getDirectoryName = (filePath) => dirname(getFileName(filePath));
const create = (source, addon) => resolve(source + "/", addon);

const youAreHere = (directoryPath) => {
  console.log(`You are currently in ${directoryPath}`);
};

export { create, getDirectoryName, getFileName, youAreHere };
