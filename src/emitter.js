import { EventEmitter } from "node:events";
import modules from "./modules/index.js";

class Emitter extends EventEmitter {
  throw = (error) => {
    this.emit("error", error);
  };

  execute = async (module, command, lineArguments, application) => {
    await modules[module][command](lineArguments, application);
  };
}

const emitter = new Emitter();

emitter.on("error", (error) => {
  console.error("error", error);
  console.error("error.message", error.message);
});

export { emitter };
