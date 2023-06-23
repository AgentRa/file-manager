import { readdir, lstat } from "node:fs/promises";
import { createPath } from "../utils/path.js";

const ls = async (_, application) => {
  if (_.length) throw new Error("Operation failed");

  try {
    const fileList = await readdir(application.pathToWorkingDirectory);

    const result = await Promise.all(
      fileList.map(async (file) => {
        const filePath = createPath(application.pathToWorkingDirectory, file);
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
    application.emitter.throw(error.message);
  }
};

const up = async (_, application) => {
  if (_.length) throw new Error("Operation failed");

  application.pathToWorkingDirectory = createPath(
    application.pathToWorkingDirectory,
    ".."
  );
  console.log(application.pathToWorkingDirectory);
};

const cd = async (commandArguments, application) => {
  if (commandArguments.length !== 1) throw new Error("Operation failed");

  try {
    const pathToDirectory = commandArguments[0].startsWith(
      application.pathToWorkingDirectory
    )
      ? commandArguments[0]
      : createPath(application.pathToWorkingDirectory, commandArguments[0]);

    await lstat(pathToDirectory);

    application.pathToWorkingDirectory = pathToDirectory;
  } catch (error) {
    application.emitter.throw("Operation failed");
  }
};

export { ls, up, cd };
