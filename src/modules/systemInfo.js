import * as operatingSystem from "node:os";

const os = (lineArguments, application) => {
  if (lineArguments.length !== 1) throw new Error("Operation failed");

  const commandOption = lineArguments.pop();

  try {
    switch (commandOption) {
      case "--EOL":
        console.log(operatingSystem.EOL);
        break;
      case "--cpus":
        console.log(operatingSystem.cpus());
        break;
      case "--homedir":
        console.log(operatingSystem.homedir());
        break;
      case "--username":
        console.log(operatingSystem.userInfo().username);
        break;
      case "--architecture":
        console.log(operatingSystem.arch());
        break;
      default:
        application.emitter.throw("Operation failed");
    }
  } catch (error) {
    application.emitter.throw(error.message);
  }
};

export { os };
