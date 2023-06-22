const lineToVariablesParse = (line, emitter) => {
  const [moduleCommand, ...commandArguments] = line
    .split(" ")
    .filter((chunk) => chunk !== "");

  const module =
    determineModule(moduleCommand) || emitter.throw("Invalid input");

  return { module, moduleCommand, commandArguments };
};

const determineModule = (moduleCommand) => {
  const modules = {
    cat: "fs",
    add: "fs",
    rn: "fs",
    cp: "fs",
    mv: "fs",
    rm: "fs",
    cd: "nwd",
    ls: "nwd",
    up: "nwd",
    os: "os",
    hash: "crypto",
    compress: "zip",
    decompress: "zip",
  };

  return modules[moduleCommand];
};

export { lineToVariablesParse };
