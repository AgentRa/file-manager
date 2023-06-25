const toParameters = (line) => {
  const [command, ...lineArguments] = line
    .split(" ")
    .filter((chunk) => chunk !== "");

  const module = determineModule(command);

  if (module === undefined)
    throw new Error(`Invalid input: command ${command} not found`);

  return { module, command, lineArguments };
};

const determineModule = (command) => {
  const modules = {
    cat: "fileSystem",
    add: "fileSystem",
    rn: "fileSystem",
    cp: "fileSystem",
    mv: "fileSystem",
    rm: "fileSystem",
    cd: "navigation",
    ls: "navigation",
    up: "navigation",
    os: "systemInfo",
    hash: "crypto",
    compress: "zip",
    decompress: "zip",
  };

  return modules[command];
};

export { toParameters };
