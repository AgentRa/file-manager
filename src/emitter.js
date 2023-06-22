import { EventEmitter } from "node:events";
import modules from "./modules/index.js";

class Emitter extends EventEmitter {
  throw = (error) => {
    this.emit("error", error);
  };

  execute = async (module, moduleCommand, commandArguments, application) => {
    await modules[module][moduleCommand](commandArguments, application);
  };
}
export { Emitter };
