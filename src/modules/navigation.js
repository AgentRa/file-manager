import { readdir, lstat } from "node:fs/promises";
import { path, validate } from "../utils/index.js";

const ls = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 0);
  try {
    const entryList = await readdir(application.pathToWorkingDirectory);

    const unsortedEntryList = await Promise.all(
      entryList.map(async (file) => {
        const source = path.create(application.pathToWorkingDirectory, file);
        const sourceStats = await lstat(source);

        if (sourceStats.isFile()) return { name: file, type: "file" };
        if (sourceStats.isDirectory()) return { name: file, type: "directory" };
        return { name: file, type: "unknown" };
      })
    );

    const directoriesSorted = unsortedEntryList
      .filter((entry) => entry?.type === "directory")
      .sort((a, b) =>
        a.name.localeCompare(b.name, lineArguments, { sensitivity: "base" })
      );
    const filesSorted = unsortedEntryList
      .filter((entry) => entry?.type === "file")
      .sort((a, b) =>
        a.name.localeCompare(b.name, lineArguments, { sensitivity: "base" })
      );
    const unknownTypesSorted = unsortedEntryList
      .filter((entry) => entry?.type === "unknown")
      .sort((a, b) =>
        a.name.localeCompare(b.name, lineArguments, { sensitivity: "base" })
      );

    console.table([
      ...directoriesSorted,
      ...filesSorted,
      ...unknownTypesSorted,
    ]);
  } catch (error) {
    application.emitter.throw(new Error(`Operation failed: ${error.message}`));
  }
};

const up = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 0);

  application.pathToWorkingDirectory = path.create(
    application.pathToWorkingDirectory,
    ".."
  );
};

const cd = async (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const source = path.create(
    application.pathToWorkingDirectory,
    lineArguments.pop()
  );
  try {
    await validate.directoryType(source);
  } catch (error) {
    application.emitter.throw(new Error(`Operation failed: ${error.message}`));
  }
  application.pathToWorkingDirectory = source;
};

export { ls, up, cd };
