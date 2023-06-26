import * as OS from "node:os";
import { validate } from "../utils/index.js";

const os = (lineArguments, application) => {
  validate.argumentLength(lineArguments, 1);

  const commandOption = lineArguments.pop();

  switch (commandOption) {
    case "--EOL":
      console.log(JSON.stringify(OS.EOL));
      break;
    case "--cpus":
      console.table(
        OS.cpus().map(({ model, speed }) => ({
          model,
          speed: speed + " GHz",
        }))
      );
      break;
    case "--homedir":
      console.log(OS.homedir());
      break;
    case "--username":
      console.log(OS.userInfo().username);
      break;
    case "--architecture":
      console.log(OS.arch());
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
