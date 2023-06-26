import * as operatingSystem from "node:os";
import { validate } from "../utils/index.js";

const os = (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const commandOption = lineArguments.pop();

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
      application.emitter.throw(new Error("Operation failed: "));
  }
};

export { os };
