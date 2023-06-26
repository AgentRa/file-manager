const lineToVariables = (line, emitter) => {
  const [command, ...lineArguments] = line
    .split(" ")
    .filter((chunk) => chunk !== "");

  const module = determineModule(command) || emitter.throw("Invalid input");

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

export { lineToVariables };
