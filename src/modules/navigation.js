import { readdir, lstat } from "node:fs/promises";
import {path}  from "../utils/index.js";

const ls = async (_, application) => {
  if (_.length) throw new Error("Operation failed");

  try {
    const fileList = await readdir(application.pathToWorkingDirectory);

    const result = await Promise.all(
      fileList.map(async (file) => {
        const source = path.create(application.pathToWorkingDirectory, file);
        const stats = await lstat(source);

        if (stats.isFile()) return { name: file, type: "file" };
        if (stats.isDirectory()) return { name: file, type: "directory" };
        return {name: file, type: "unknown"}
      })
    );

    const directoriesSorted = result
      .filter((entry) => entry?.type === "directory")
      .sort((a, b) => a.name.localeCompare(b.name, _, { sensitivity: "base" }));
    const filesSorted = result
      .filter((entry) => entry?.type === "file")
      .sort((a, b) => a.name.localeCompare(b.name, _, { sensitivity: "base" }));

    console.table([...directoriesSorted, ...filesSorted]);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

const up = async (_, application) => {
  if (_.length) throw new Error("Operation failed");

  application.pathToWorkingDirectory = path.create(application.pathToWorkingDirectory, '..')

  console.log(application.pathToWorkingDirectory);
};

const cd = async (commandArguments, application) => {
  if (commandArguments.length !== 1) throw new Error("Operation failed");

  try {
    const source = path.create(application.pathToWorkingDirectory, commandArguments[0])

    await lstat(source);

    application.pathToWorkingDirectory = source;
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

export { ls, up, cd };
