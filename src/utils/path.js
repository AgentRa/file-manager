import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const filename = (filePath) => fileURLToPath(filePath);
const getDirectoryName = (filePath) => dirname(filename(filePath));
const create = (source, addon) => resolve(source + "/", addon);

const zip = (source) => "/" + source.split("/").pop() + ".gz";

const unzip = (source) => "/" + source.split("/").pop().slice(0, -3);

const youAreHere = (directoryPath) => {
  console.log(`You are currently in ${directoryPath}`);
};

export { create, getDirectoryName, filename, youAreHere, zip, unzip };
