import * as operatingSystem from "node:os";
import { validate } from "../utils/index.js";

const os = (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const commandOption = lineArguments.pop();

  switch (commandOption) {
    case "--EOL":
      console.log(JSON.stringify(operatingSystem.EOL));
      break;
    case "--cpus":
      console.table(
        operatingSystem.cpus().map(({ model, speed }) => ({
          model,
          speed: speed + " GHz",
        }))
      );
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
      application.emitter.throw(
        new Error(
          `Invalid input: ${commandOption} is not a valid option for [os] module`
        )
      );
  }
};

export { os };
