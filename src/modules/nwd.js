import { readdir, lstat } from "node:fs/promises";
import { createPath } from "../utils/pathParsers.js";

const ls = async (_, emitter) => {
  if (_.length) throw new Error("Operation failed");

  try {
    const fileList = await readdir(emitter.pathToWorkingDirectory);

    const result = await Promise.all(
      fileList.map(async (file) => {
        const filePath = createPath(emitter.pathToWorkingDirectory, file);
        const stats = await lstat(filePath);

        if (stats.isFile()) return { name: file, type: "file" };
        if (stats.isDirectory()) return { name: file, type: "directory" };
      })
    );

    const directoriesSorted = result
      .filter((entry) => entry && entry.type === "directory")
      .sort((a, b) => a.name.localeCompare(b.name, _, { sensitivity: "base" }));
    const filesSorted = result
      .filter((entry) => entry && entry.type === "file")
      .sort((a, b) => a.name.localeCompare(b.name, _, { sensitivity: "base" }));

    console.table([...directoriesSorted, ...filesSorted]);
  } catch (error) {
    emitter.throw(error.message);
  }
};

const up = async (_, state) => {
  if (_.length) throw new Error("Operation failed");

  state.pathToWorkingDirectory = createPath(state.pathToWorkingDirectory, "..");
  console.log(state.pathToWorkingDirectory);
};

const cd = async (commandArguments, state) => {
  if (commandArguments.length !== 1) throw new Error("Operation failed");

  try {
    const pathToDirectory = commandArguments[0].startsWith(
      state.pathToWorkingDirectory
    )
      ? commandArguments[0]
      : createPath(state.pathToWorkingDirectory, commandArguments[0]);

    await lstat(pathToDirectory);

    state.pathToWorkingDirectory = pathToDirectory;
  } catch (error) {
    state.errorEventEmitter.throw("Operation failed");
  }
};

export { ls, up, cd };
