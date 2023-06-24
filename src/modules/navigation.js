import { readdir, lstat } from "node:fs/promises";
import { path } from "../utils/index.js";

const ls = async (lineArguments, application) => {
  if (lineArguments.length) throw new Error("Operation failed");

  try {
    const fileList = await readdir(application.pathToWorkingDirectory);

    const result = await Promise.all(
      fileList.map(async (file) => {
        const source = path.create(application.pathToWorkingDirectory, file);
        const sourceStats = await lstat(source);

        if (sourceStats.isFile()) return { name: file, type: "file" };
        if (sourceStats.isDirectory()) return { name: file, type: "directory" };
        return { name: file, type: "unknown" };
      })
    );

    const directoriesSorted = result
      .filter((entry) => entry?.type === "directory")
      .sort((a, b) =>
        a.name.localeCompare(b.name, lineArguments, { sensitivity: "base" })
      );
    const filesSorted = result
      .filter((entry) => entry?.type === "file")
      .sort((a, b) =>
        a.name.localeCompare(b.name, lineArguments, { sensitivity: "base" })
      );

    console.table([...directoriesSorted, ...filesSorted]);
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

const up = async (lineArguments, application) => {
  if (lineArguments.length) throw new Error("Operation failed");

  application.pathToWorkingDirectory = path.create(
    application.pathToWorkingDirectory,
    ".."
  );
};

const cd = async (lineArguments, application) => {
  if (lineArguments.length !== 1) throw new Error("Operation failed");

  const pathToDirectory = lineArguments.pop();

  try {
    const source = path.create(
      application.pathToWorkingDirectory,
      pathToDirectory
    );

    await lstat(source);

    application.pathToWorkingDirectory = source;
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

export { ls, up, cd };
